import type { EFFECTS, ShowcaseView, SpriteView } from "@/lib/showcase";

// The arcade showcase's game loop, kept apart from React: one canvas, a fixed 960×540 world
// scaled to fit, the seller's sprite sheets drawn frame by frame. React (Arcade.tsx) only owns
// the overlays and the score.

const W = 960;
const H = 540;
const PLAYER_H = 118; // on-screen height of the hero's visible art, in world units
const TARGET_H = 92;
const COOLDOWN = 0.2;

type Effect = (typeof EFFECTS)[number];

const PALETTES: Record<Effect, string[]> = {
  fire: ["#fff3b0", "#ffd166", "#fb8500", "#e63946"],
  ice: ["#ffffff", "#caf0f8", "#90e0ef", "#48cae4"],
  lightning: ["#ffffff", "#fffbcc", "#ffe600", "#9bb7ff"],
  poison: ["#f1ff8f", "#b5e48c", "#76c893", "#52b788"],
  magic: ["#ffffff", "#f1c0e8", "#cfbaf0", "#a06cd5"],
};

/** A sprite sheet ready to draw, with the box its art fills inside a frame (sheets are padded). */
type Sheet = {
  img: HTMLImageElement;
  fw: number;
  fh: number;
  cols: number;
  frames: number;
  ms: number;
  natural: 1 | -1; // which way the art faces
  box: { x: number; y: number; w: number; h: number }; // fraction of the frame
};

type Target = { sheet: Sheet; x: number; y: number; baseY: number; vx: number; bob: number; phase: number; size: number; dying: number; t: number };
type Shot = { x: number; y: number; vx: number; life: number };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number; color: string };

export type ArcadeEvents = { onReady(): void; onFail(): void; onScore(n: number): void; onWin(): void };

export type Arcade = { start(): void; destroy(): void };

export function createArcade(canvas: HTMLCanvasElement, show: ShowcaseView, ev: ArcadeEvents): Arcade {
  const ctx = canvas.getContext("2d")!;
  const colors = PALETTES[show.effect];
  let destroyed = false;
  let running = false;
  let raf = 0;

  let player: Sheet | null = null;
  let enemies: Sheet[] = [];
  let backdrop: HTMLImageElement | null = null;

  const me = { x: W * 0.3, y: H * 0.5, tx: W * 0.3, ty: H * 0.5, facing: 1 as 1 | -1, t: 0, cooldown: 0 };
  let targets: Target[] = [];
  let shots: Shot[] = [];
  let sparks: Spark[] = [];
  let score = 0;
  let spawnIn = 0;
  let nextEnemy = 0;
  let last = 0;
  const keys = new Set<string>();

  // ---- Loading ----------------------------------------------------------------------------

  const load = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`image ${src}`));
      img.src = src;
    });

  async function sheet(s: SpriteView): Promise<Sheet> {
    const img = await load(s.src);
    const fw = img.naturalWidth / s.cols;
    const fh = img.naturalHeight / s.rows;
    return { img, fw, fh, cols: s.cols, frames: s.frames, ms: s.ms ?? 120, natural: s.faces === "right" ? 1 : -1, box: artBox(img, s, fw, fh) };
  }

  Promise.all([sheet(show.player), Promise.allSettled(show.targets.map(sheet)), show.backdrop ? load(show.backdrop).catch(() => null) : null])
    .then(([p, ts, bg]) => {
      if (destroyed) return;
      player = p;
      enemies = ts.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
      backdrop = bg;
      if (!enemies.length) throw new Error("no enemies loaded");
      resize();
      draw(); // a still frame behind the start screen
      ev.onReady();
    })
    .catch(() => !destroyed && ev.onFail());

  // ---- Input ------------------------------------------------------------------------------

  const toWorld = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  };
  const onMove = (e: PointerEvent) => {
    if (!running) return;
    const p = toWorld(e);
    me.tx = p.x;
    me.ty = p.y;
  };
  const onDown = (e: PointerEvent) => {
    if (!running) return;
    onMove(e);
    // A tap means "attack". On a touchscreen, also face where the finger went down.
    if (e.pointerType === "touch" && Math.abs(me.tx - me.x) > 30) me.facing = me.tx > me.x ? 1 : -1;
    fire();
  };
  const onKey = (e: KeyboardEvent) => {
    if (!running) return;
    const k = e.key;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(k)) e.preventDefault();
    if (e.type === "keydown") {
      if (k === " " || k === "Enter") fire();
      else keys.add(k);
    } else keys.delete(k);
  };
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("keydown", onKey);
  canvas.addEventListener("keyup", onKey);

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth || W;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round((w * H / W) * dpr);
    ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
    ctx.imageSmoothingQuality = "high";
    if (!running && player) draw();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  // ---- Game -------------------------------------------------------------------------------

  function fire() {
    if (!player || me.cooldown > 0) return;
    me.cooldown = COOLDOWN;
    const { w, h } = drawSize(player, PLAYER_H);
    const speed = show.effect === "lightning" ? 1300 : 820;
    shots.push({ x: me.x + me.facing * w * 0.42, y: me.y - h * 0.08, vx: me.facing * speed, life: 1 });
  }

  function spawn() {
    const sheet = enemies[nextEnemy++ % enemies.length];
    const fromLeft = Math.random() < 0.35;
    const size = TARGET_H * (0.85 + Math.random() * 0.35);
    const { w } = drawSize(sheet, size);
    const y = H * (0.18 + Math.random() * 0.64);
    targets.push({
      sheet,
      x: fromLeft ? -w : W + w,
      y,
      baseY: y,
      vx: (fromLeft ? 1 : -1) * (85 + Math.random() * 80 + score * 4),
      bob: 18 + Math.random() * 34,
      phase: Math.random() * Math.PI * 2,
      size,
      dying: 0,
      t: Math.random() * 10,
    });
  }

  function burst(x: number, y: number, n: number, speed: number) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = speed * (0.3 + Math.random());
      const max = 0.35 + Math.random() * 0.45;
      sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: max, max, r: 3 + Math.random() * 6, color: colors[(Math.random() * colors.length) | 0] });
    }
  }

  function update(dt: number) {
    me.t += dt;
    me.cooldown = Math.max(0, me.cooldown - dt);
    const kx = (keys.has("ArrowRight") ? 1 : 0) - (keys.has("ArrowLeft") ? 1 : 0);
    const ky = (keys.has("ArrowDown") ? 1 : 0) - (keys.has("ArrowUp") ? 1 : 0);
    if (kx || ky) {
      me.tx = me.x + kx * 60;
      me.ty = me.y + ky * 60;
    }
    me.tx = clamp(me.tx, 40, W - 40);
    me.ty = clamp(me.ty, 50, H - 50);
    const dx = (me.tx - me.x) * Math.min(1, dt * 7);
    me.x += dx;
    me.y += (me.ty - me.y) * Math.min(1, dt * 7);
    if (Math.abs(dx) > 1.5) me.facing = dx > 0 ? 1 : -1;

    spawnIn -= dt;
    if (spawnIn <= 0 && targets.filter((t) => !t.dying).length < 3) {
      spawn();
      spawnIn = 0.9 + Math.random() * 0.9;
    }

    for (const s of shots) {
      s.x += s.vx * dt;
      s.life -= dt * 1.1;
      // The trail: the attack's own colours, drifting off behind the shot.
      for (let i = 0; i < 3; i++) {
        const max = 0.25 + Math.random() * 0.3;
        sparks.push({
          x: s.x + (Math.random() - 0.5) * 10,
          y: s.y + (Math.random() - 0.5) * 14,
          vx: -s.vx * 0.08 + (Math.random() - 0.5) * 60,
          vy: (Math.random() - 0.5) * 60 - (show.effect === "fire" ? 40 : 0),
          life: max,
          max,
          r: 4 + Math.random() * 7,
          color: colors[(Math.random() * colors.length) | 0],
        });
      }
    }

    for (const t of targets) {
      t.t += dt;
      if (t.dying) {
        t.dying += dt;
        t.y -= dt * 40;
        continue;
      }
      t.x += t.vx * dt;
      t.y = t.baseY + Math.sin(t.t * 1.6 + t.phase) * t.bob;
      const { w, h } = drawSize(t.sheet, t.size);
      const r = Math.min(w, h) * 0.45;
      for (const s of shots) {
        if (s.life > 0 && Math.hypot(s.x - t.x, s.y - t.y) < r + 16) {
          s.life = 0;
          t.dying = 0.001;
          burst(t.x, t.y, 34, 260);
          score++;
          ev.onScore(score);
          break;
        }
      }
    }

    shots = shots.filter((s) => s.life > 0 && s.x > -50 && s.x < W + 50);
    targets = targets.filter((t) => t.dying < 0.45 && t.x > -300 && t.x < W + 300);
    for (const p of sparks) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 1 - dt * 2.5;
      p.vy *= 1 - dt * 2.5;
      p.life -= dt;
    }
    sparks = sparks.filter((p) => p.life > 0);
    if (sparks.length > 600) sparks = sparks.slice(-600);

    if (score >= show.goal) {
      running = false;
      burst(me.x, me.y, 80, 360);
      ev.onWin();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    if (backdrop) {
      // Cover the stage, drifting a little against the hero for depth.
      const s = Math.max(W / backdrop.naturalWidth, H / backdrop.naturalHeight) * 1.08;
      const bw = backdrop.naturalWidth * s;
      const bh = backdrop.naturalHeight * s;
      const px = (me.x / W - 0.5) * (bw - W);
      const py = (me.y / H - 0.5) * (bh - H) * 0.6;
      ctx.drawImage(backdrop, (W - bw) / 2 - px * 0.6, (H - bh) / 2 - py * 0.6, bw, bh);
    } else {
      const css = getComputedStyle(canvas);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, css.getPropertyValue("--surface").trim() || "#1d2b53");
      g.addColorStop(1, css.getPropertyValue("--bg").trim() || "#0b1026");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    for (const t of targets) {
      ctx.globalAlpha = t.dying ? Math.max(0, 1 - t.dying / 0.45) : 1;
      if (t.dying) ctx.filter = "brightness(2.2)";
      sprite(t.sheet, t.x, t.y, t.size, t.vx > 0 ? 1 : -1, t.t);
      ctx.filter = "none";
    }
    ctx.globalAlpha = 1;

    if (player) sprite(player, me.x, me.y + Math.sin(me.t * 3) * 4, PLAYER_H, me.facing, me.t);

    // Glow: additive blending makes overlapping sparks burn brighter, like the real thing.
    ctx.globalCompositeOperation = "lighter";
    for (const p of sparks) {
      const k = p.life / p.max;
      ctx.globalAlpha = k * 0.9;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (0.4 + k * 0.6), 0, Math.PI * 2);
      ctx.fill();
    }
    for (const s of shots) {
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 22);
      g.addColorStop(0, colors[0]);
      g.addColorStop(0.5, colors[2]);
      g.addColorStop(1, "transparent");
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 22, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
  }

  /** One frame of a sheet, its visible art centred on (x, y) at height h, facing dir. */
  function sprite(s: Sheet, x: number, y: number, h: number, dir: 1 | -1, t: number) {
    const f = Math.floor((t * 1000) / s.ms) % s.frames;
    const sx = (f % s.cols) * s.fw;
    const sy = Math.floor(f / s.cols) * s.fh;
    const scale = h / (s.box.h * s.fh);
    const dw = s.fw * scale;
    const dh = s.fh * scale;
    // Offset so the art box, not the padded frame, lands on (x, y).
    const ox = (s.box.x + s.box.w / 2) * dw;
    const oy = (s.box.y + s.box.h / 2) * dh;
    ctx.save();
    ctx.translate(x, y);
    if (dir !== s.natural) ctx.scale(-1, 1);
    ctx.drawImage(s.img, sx, sy, s.fw, s.fh, -ox, -oy, dw, dh);
    ctx.restore();
  }

  function drawSize(s: Sheet, h: number) {
    return { w: h * ((s.box.w * s.fw) / (s.box.h * s.fh)), h };
  }

  function loop(now: number) {
    if (destroyed) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (running) update(dt);
    draw();
    // After a win, let the last sparks fade out, then stop drawing.
    if (running || sparks.length) raf = requestAnimationFrame(loop);
  }

  return {
    start() {
      if (!player || destroyed) return;
      cancelAnimationFrame(raf);
      targets = [];
      shots = [];
      sparks = [];
      score = 0;
      spawnIn = 0.4;
      me.x = me.tx = W * 0.3;
      me.y = me.ty = H * 0.5;
      me.facing = 1;
      running = true;
      ev.onScore(0);
      canvas.focus({ preventScroll: true });
      last = performance.now();
      raf = requestAnimationFrame(loop);
    },
    destroy() {
      destroyed = true;
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("keydown", onKey);
      canvas.removeEventListener("keyup", onKey);
    },
  };
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * The smallest box holding the art of every frame, as fractions of a frame. Sheets pad their
 * frames unevenly, so sizing and hit-testing by the frame itself would make enemies look and
 * feel different sizes. Measured on a small copy; the full frame if the browser won't say.
 */
function artBox(img: HTMLImageElement, s: SpriteView, fw: number, fh: number) {
  const full = { x: 0, y: 0, w: 1, h: 1 };
  try {
    const k = Math.min(1, 96 / Math.max(fw, fh));
    const cw = Math.max(1, Math.round(fw * k));
    const ch = Math.max(1, Math.round(fh * k));
    const c = document.createElement("canvas");
    c.width = cw * s.cols;
    c.height = ch * s.rows;
    const g = c.getContext("2d", { willReadFrequently: true })!;
    g.drawImage(img, 0, 0, c.width, c.height);
    const px = g.getImageData(0, 0, c.width, c.height).data;
    let x0 = cw, y0 = ch, x1 = -1, y1 = -1;
    for (let f = 0; f < s.frames; f++) {
      const ox = (f % s.cols) * cw;
      const oy = Math.floor(f / s.cols) * ch;
      for (let y = 0; y < ch; y++) {
        for (let x = 0; x < cw; x++) {
          if (px[((oy + y) * c.width + ox + x) * 4 + 3] > 40) {
            if (x < x0) x0 = x;
            if (x > x1) x1 = x;
            if (y < y0) y0 = y;
            if (y > y1) y1 = y;
          }
        }
      }
    }
    if (x1 < 0) return full;
    return { x: x0 / cw, y: y0 / ch, w: (x1 - x0 + 1) / cw, h: (y1 - y0 + 1) / ch };
  } catch {
    return full;
  }
}
