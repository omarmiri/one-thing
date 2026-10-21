import "server-only";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

// Reads a seller's own product page (their game, their Etsy listing, their portfolio) when
// Channel3 doesn't know it. The URL comes from the user, so the server only ever fetches public
// addresses: no localhost, private ranges or cloud metadata, a few redirects, small bodies.

const MAX_HTML = 2 * 1024 * 1024;   // a page is still useful cut short
const MAX_IMAGE = 8 * 1024 * 1024;  // an image is not: too big means skip it

function privateAddress(ip: string): boolean {
  if (isIP(ip) === 6) {
    const v = ip.toLowerCase();
    if (v.startsWith("::ffff:")) return privateAddress(v.slice(7));
    return v === "::1" || v === "::" || v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe80");
  }
  const [a, b] = ip.split(".").map(Number);
  return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || a >= 224;
}

async function assertPublic(url: URL) {
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Only http(s) links work.");
  if (url.port && !["80", "443"].includes(url.port)) throw new Error("That link uses an unusual port.");
  const hosts = isIP(url.hostname) ? [{ address: url.hostname }] : await lookup(url.hostname, { all: true });
  if (!hosts.length || hosts.some((h) => privateAddress(h.address))) throw new Error("That link isn't a public web page.");
}

/** fetch() that re-checks every redirect hop against assertPublic. */
async function safeFetch(raw: string, accept: string): Promise<Response> {
  let url = new URL(raw);
  for (let hop = 0; hop < 4; hop++) {
    await assertPublic(url);
    const res = await fetch(url, {
      redirect: "manual",
      headers: { accept, "user-agent": "OneThingBot/1.0 (+product page import)" },
      signal: AbortSignal.timeout(10_000),
    });
    const next = res.status >= 300 && res.status < 400 ? res.headers.get("location") : null;
    if (!next) return res;
    url = new URL(next, url);
  }
  throw new Error("Too many redirects.");
}

/** The body, or null if it's over max (truncate=false) / cut at max (truncate=true). */
async function readCapped(res: Response, max: number, truncate: boolean): Promise<Uint8Array | null> {
  const reader = res.body?.getReader();
  if (!reader) return truncate ? new Uint8Array() : null;
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > max) {
      await reader.cancel();
      if (!truncate) return null;
      break;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export type PageInfo = {
  url: string;
  title: string | null;
  description: string | null;
  text: string;
  image: { data: Uint8Array; mime: string } | null;
  /** Every image the page uses, including CSS backgrounds such as sprite sheets: candidates for a showcase. */
  images: string[];
  /** Sprite grids the page declares itself (data-sprite-cols and the like), by image URL. */
  sprites: Record<string, SpriteHint>;
};

export type SpriteHint = { cols: number; rows: number; frames: number; ms: number | null };

const meta = (html: string, key: string) => {
  const re = new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]*>`, "i");
  const tag = html.match(re)?.[0];
  return tag?.match(/content=["']([^"']*)["']/i)?.[1]?.trim() || null;
};
const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));

/** Title, description, readable text and the share image of a public page. */
export async function fetchPage(rawUrl: string): Promise<PageInfo> {
  const res = await safeFetch(rawUrl, "text/html,application/xhtml+xml");
  if (!res.ok) throw new Error(`That page answered ${res.status}.`);
  const html = new TextDecoder().decode((await readCapped(res, MAX_HTML, true)) ?? new Uint8Array());
  const title = decode(meta(html, "og:title") ?? html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? "") || null;
  const description = decode(meta(html, "og:description") ?? meta(html, "description") ?? "") || null;
  const text = decode(
    html
      .replace(/<(script|style|noscript|svg|template)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " "),
  ).slice(0, 6000);

  const base = res.url || rawUrl;
  const imgUrl = meta(html, "og:image") ?? meta(html, "twitter:image");
  const sprites = spriteHints(html, base);
  const [image, found] = await Promise.all([
    imgUrl ? fetchImage(new URL(imgUrl, base).toString()) : null,
    pageImages(html, base),
  ]);
  // Declared sprite sheets are the surest showcase art, so they go first.
  const images = [...new Set([...Object.keys(sprites), ...found])].slice(0, 60);
  return { url: rawUrl, title, description, text, image, images, sprites };
}

const IMAGE_EXT = /\.(png|webp|jpe?g|gif)(\?|#|$)/i;
const MAX_CSS = 512 * 1024;

/**
 * Pages that animate sprites in script often say how: <div data-sprite-src="dragon.png"
 * data-sprite-cols="4" data-sprite-rows="2" data-sprite-frames="8" data-sprite-ms="180">.
 * When they do, that beats measuring the sheet.
 */
function spriteHints(html: string, base: string): Record<string, SpriteHint> {
  const out: Record<string, SpriteHint> = {};
  for (const [tag] of html.matchAll(/<[a-z][^>]*\sdata-(?:sprite-)?src=["'][^>]*>/gi)) {
    const attr = (name: string) => tag.match(new RegExp(`\\sdata-(?:sprite-)?${name}=["']?([^"'\\s>]+)`, "i"))?.[1];
    const num = (name: string) => {
      const n = Number(attr(name));
      return Number.isInteger(n) && n > 0 ? n : null;
    };
    const src = attr("src");
    const cols = num("cols") ?? num("columns");
    const rows = num("rows") ?? 1;
    if (!src || !cols || cols > 32 || rows > 32) continue;
    try {
      const u = new URL(decode(src), base);
      if (!/^https?:$/.test(u.protocol) || !IMAGE_EXT.test(u.pathname)) continue;
      const frames = Math.min(num("frames") ?? cols * rows, cols * rows);
      const ms = num("ms");
      out[u.toString()] = { cols, rows, frames, ms: ms && ms >= 40 && ms <= 2000 ? ms : null };
    } catch {}
  }
  return out;
}

/** Image URLs from <img>, srcset, meta tags, inline styles and the page's own stylesheets. */
async function pageImages(html: string, base: string): Promise<string[]> {
  const found = new Set<string>();
  const add = (raw: string | undefined, from: string) => {
    if (!raw || raw.startsWith("data:")) return;
    try {
      const u = new URL(decode(raw.trim()), from);
      if (/^https?:$/.test(u.protocol) && IMAGE_EXT.test(u.pathname)) found.add(u.toString());
    } catch {}
  };
  const cssUrls = (css: string, from: string) => {
    for (const m of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) add(m[1], from);
  };
  for (const m of html.matchAll(/<img[^>]*>/gi)) {
    add(m[0].match(/\ssrc=["']([^"']+)["']/i)?.[1], base);
    add(m[0].match(/\sdata-src=["']([^"']+)["']/i)?.[1], base);
    const srcset = m[0].match(/\ssrcset=["']([^"']+)["']/i)?.[1];
    srcset?.split(",").forEach((c) => add(c.trim().split(/\s+/)[0], base));
  }
  for (const key of ["og:image", "twitter:image"]) add(meta(html, key) ?? undefined, base);
  cssUrls(html, base); // inline style attributes and <style> blocks

  // Sprite sheets usually live in the site's stylesheets. Same-site only, a few, size-capped.
  const sheets = [...html.matchAll(/<link[^>]*rel=["']?stylesheet["']?[^>]*>/gi)]
    .map((m) => m[0].match(/href=["']([^"']+)["']/i)?.[1])
    .filter((h): h is string => Boolean(h))
    .map((h) => new URL(decode(h), base))
    .filter((u) => u.host === new URL(base).host)
    .slice(0, 4);
  await Promise.all(
    sheets.map(async (u) => {
      try {
        const res = await safeFetch(u.toString(), "text/css");
        if (res.ok) cssUrls(new TextDecoder().decode((await readCapped(res, MAX_CSS, true)) ?? new Uint8Array()), res.url || u.toString());
      } catch {}
    }),
  );
  return [...found].slice(0, 60);
}

/** A public image (product photo, og:image), or null if it can't be had. */
export async function fetchImage(url: string): Promise<{ data: Uint8Array; mime: string } | null> {
  try {
    const res = await safeFetch(url, "image/*");
    const mime = res.headers.get("content-type")?.split(";")[0] ?? "";
    if (!res.ok || !/^image\/(jpeg|png|webp|gif)$/.test(mime)) return null;
    const data = await readCapped(res, MAX_IMAGE, false);
    return data?.length ? { data, mime } : null;
  } catch {
    return null;
  }
}
