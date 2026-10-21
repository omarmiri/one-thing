import "server-only";
import sharp from "sharp";
import { fetchImage, type SpriteHint } from "./fetchPage";
import { directShowcase } from "./gemini";
import { saveBlob } from "./shops";
import type { Showcase, Sprite } from "./showcase";

// A seller's game page is full of art: sprite sheets for the hero and enemies, backdrops.
// We download what the page uses, and measure each image ourselves (frame grid, size, alpha) so
// Gemini only has to choose and describe, never count pixels.

export type Asset = {
  url: string;
  data: Uint8Array;
  mime: string;
  width: number;
  height: number;
  alpha: boolean;
  cols: number; // sprite sheet grid; 1×1 for a plain image
  rows: number;
  frames: number; // filled cells in reading order
  ms: number | null; // per frame, when the page says
  kind: "sprite" | "backdrop" | "image";
  thumb: Uint8Array; // first frame, small PNG: what Gemini looks at
};

const MAX_ASSETS = 24;
const MAX_SPRITES = 16; // the rest of the budget is for backdrops
const MIN_SIDE = 48;

/**
 * A playable teaser for a game page, or null when the page isn't a game, has too little art,
 * or anything fails: a showcase is a bonus and never holds up the shop.
 */
export async function buildShowcase(
  context: string,
  imageUrls: string[],
  hints: Record<string, SpriteHint> = {},
): Promise<{ showcase: Showcase; blobs: string[] } | null> {
  try {
    const assets = await loadAssets(imageUrls, hints);
    if (assets.filter((a) => a.kind === "sprite").length < 2) return null;
    const label = (a: Asset) =>
      a.kind === "sprite"
        ? `sprite sheet, ${a.cols}×${a.rows} grid, ${a.frames} frames of ${Math.round(a.width / a.cols)}×${Math.round(a.height / a.rows)} px`
        : `${a.kind === "backdrop" ? "wide background" : a.alpha ? "cut-out image" : "image"}, ${a.width}×${a.height} px`;
    const dir = await directShowcase(context, assets.map((a) => ({ label: label(a), thumb: a.thumb })));
    if (!dir?.isGame) return null;

    // Trust Gemini's taste, not its arithmetic: every pick must be a real, different sprite.
    const used = new Set<number>();
    const pick = (i: number) => (assets[i]?.kind === "sprite" && !used.has(i) ? (used.add(i), assets[i]) : null);
    const player = pick(dir.player.asset);
    const targets = dir.targets.map((t) => ({ t, a: pick(t.asset) })).filter((x) => x.a);
    if (!player || targets.length === 0) return null;
    const backdropAsset = dir.backdrop >= 0 && assets[dir.backdrop] && !used.has(dir.backdrop) ? assets[dir.backdrop] : null;

    const blobs: string[] = [];
    const store = async (a: Asset) => {
      // Smaller sheets load faster; the grid is proportional, so scaling keeps it intact.
      const data = await sharp(a.data).resize({ width: Math.min(a.width, 2048), withoutEnlargement: true }).webp({ quality: 88 }).toBuffer();
      const id = await saveBlob(new Uint8Array(data), "image/webp");
      blobs.push(id);
      return id;
    };
    const sprite = async (a: Asset, name: string, faces: "left" | "right"): Promise<Sprite> => ({
      blob: await store(a),
      cols: a.cols,
      rows: a.rows,
      frames: a.frames,
      ...(a.ms && { ms: a.ms }),
      faces,
      name,
    });

    const showcase: Showcase = {
      kind: "arcade",
      title: dir.title,
      instructions: dir.instructions,
      verb: dir.verb,
      pastVerb: dir.pastVerb,
      effect: dir.effect,
      goal: dir.goal,
      winTitle: dir.winTitle,
      winText: dir.winText,
      player: await sprite(player, dir.player.name, dir.player.faces),
      targets: await Promise.all(targets.map(({ t, a }) => sprite(a!, t.name, t.faces))),
      backdrop: backdropAsset ? await store(backdropAsset) : null,
    };
    return { showcase, blobs };
  } catch (err) {
    console.warn("showcase skipped:", (err as Error).message);
    return null;
  }
}

/** Downloads and measures a page's images. Skips anything unreadable, tiny or huge. */
export async function loadAssets(urls: string[], hints: Record<string, SpriteHint> = {}): Promise<Asset[]> {
  // A page can declare dozens of sprite sheets; keep room for the rest, where backdrops are.
  const declared = urls.filter((u) => hints[u]).slice(0, 16);
  const others = urls.filter((u) => !hints[u]).slice(0, 40 - declared.length);
  const out = await Promise.all([...declared, ...others].map(async (url) => {
    try {
      return await measure(url, hints[url]);
    } catch {
      return null;
    }
  }));
  const found = out.filter((a): a is Asset => Boolean(a));
  const sprites = found.filter((a) => a.kind === "sprite").slice(0, MAX_SPRITES);
  return [...sprites, ...found.filter((a) => a.kind !== "sprite").slice(0, MAX_ASSETS - sprites.length)];
}

async function measure(url: string, hint?: SpriteHint): Promise<Asset | null> {
  const img = await fetchImage(url);
  if (!img) return null;
  const meta = await sharp(img.data, { animated: false }).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  if (width < MIN_SIDE || height < MIN_SIDE || width * height > 40_000_000) return null;

  const alpha = Boolean(meta.hasAlpha);
  // A grid the page declares wins over one we measure, as long as its frames are a sensible size.
  const declared = hint && width / hint.cols >= 16 && height / hint.rows >= 16 ? hint : null;
  const grid = declared
    ? { cols: declared.cols, rows: declared.rows, frames: declared.frames }
    : alpha ? await spriteGrid(img.data, width, height) : { cols: 1, rows: 1, frames: 1 };
  const fw = Math.floor(width / grid.cols);
  const fh = Math.floor(height / grid.rows);
  const sprite = (alpha || Boolean(declared)) && grid.frames > 1;
  const kind = sprite ? "sprite" : !alpha && width >= 800 && width / height >= 1.2 ? "backdrop" : "image";
  const thumb = await sharp(img.data)
    .extract({ left: 0, top: 0, width: fw, height: fh })
    .resize({ width: 192, height: 192, fit: "inside" })
    .png()
    .toBuffer();
  return { url, data: img.data, mime: img.mime, width, height, alpha, ...grid, ms: declared?.ms ?? null, kind, thumb };
}

/**
 * The frame grid of a sprite sheet, from its alpha channel. A grid of n columns fits when every
 * boundary between columns lands on (nearly) empty pixels, so we take the largest n that fits.
 * Sheets whose frames touch with no gap fall back to square frames along the long side.
 */
async function spriteGrid(data: Uint8Array, width: number, height: number) {
  // Work on a downscaled alpha mask: plenty for finding gaps, and fast on big sheets.
  const scale = Math.min(1, 1024 / Math.max(width, height));
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));
  const { data: px } = await sharp(data).resize(w, h, { fit: "fill" }).ensureAlpha().extractChannel(3).raw().toBuffer({ resolveWithObject: true });
  const solid = (x: number, y: number) => px[y * w + x] > 24;
  const colFill = Array.from({ length: w }, (_, x) => {
    let n = 0;
    for (let y = 0; y < h; y++) if (solid(x, y)) n++;
    return n / h;
  });
  const rowFill = Array.from({ length: h }, (_, y) => {
    let n = 0;
    for (let x = 0; x < w; x++) if (solid(x, y)) n++;
    return n / w;
  });

  const fits = (fill: number[], n: number) => {
    const len = fill.length;
    for (let k = 1; k < n; k++) {
      const at = Math.round((k * len) / n);
      // The boundary, or a pixel either side of it, must be close to empty.
      const near = [at - 1, at, at + 1].filter((i) => i >= 0 && i < len).map((i) => fill[i]);
      if (Math.min(...near) > 0.02) return false;
    }
    return true;
  };
  const best = (fill: number[], max: number) => {
    for (let n = max; n >= 2; n--) if (fits(fill, n) && fill.length / n >= 24) return n;
    return 1;
  };

  let cols = best(colFill, 16);
  let rows = best(rowFill, 8);
  if (cols === 1 && rows === 1) {
    const ratio = width / height;
    if (ratio >= 2.5) cols = Math.round(ratio);
    else if (ratio <= 0.4) rows = Math.round(1 / ratio);
  } else {
    // Split one way only, with frames far from square: the other way has frames touching.
    // Sprite frames are close to square, so split that way too.
    const frameRatio = width / cols / (height / rows);
    if (rows === 1 && frameRatio <= 0.55) rows = Math.round(1 / frameRatio);
    if (cols === 1 && frameRatio >= 1.8) cols = Math.round(frameRatio);
  }

  // Count filled cells in reading order: the last row of a sheet is often only part full.
  let frames = 0;
  outer: for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x0 = Math.floor((c * w) / cols), x1 = Math.floor(((c + 1) * w) / cols);
      const y0 = Math.floor((r * h) / rows), y1 = Math.floor(((r + 1) * h) / rows);
      let n = 0;
      for (let y = y0; y < y1 && n < 8; y++) for (let x = x0; x < x1 && n < 8; x++) if (solid(x, y)) n++;
      if (n < 8) break outer;
      frames++;
    }
  }
  return { cols, rows, frames: Math.max(1, frames) };
}
