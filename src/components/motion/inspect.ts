import { clamp, prefersReducedMotion, Spring, SPRING, type Feel } from "./springs";

// Inspect: tap a product photo and that same photo grows out of the page to fill the screen (a
// shared-element transition, not a modal that pops in). With several photos, swipe sideways
// (or use the arrows) to page through them. Drag to look around, double-tap to zoom, flick or
// drag down (or Esc) and the photo falls back into its place on the page.

export type InspectOptions = {
  photos: { src: string; alt: string }[];
  index: number;
  /** The page element showing photo i, to grow from and fall back into. null: fade in place. */
  source(i: number): HTMLImageElement | null;
  /** Called as the buyer pages through, so the page can show the same photo underneath. */
  onIndex?(i: number): void;
  feel?: () => Feel;
};

/** Single photos marked data-inspect open on click. Galleries call openInspect themselves. */
export function attachInspect(root: HTMLElement, getFeel: () => Feel): () => void {
  const onClick = (e: MouseEvent) => {
    const img = (e.target as Element).closest?.("[data-inspect] img, img[data-inspect]") as HTMLImageElement | null;
    if (!img || !root.contains(img)) return;
    e.preventDefault();
    openInspect({ photos: [{ src: img.currentSrc || img.src, alt: img.alt }], index: 0, source: () => img, feel: getFeel });
  };
  root.addEventListener("click", onClick);
  for (const img of root.querySelectorAll<HTMLElement>("[data-inspect] img, img[data-inspect]")) img.style.cursor = "zoom-in";
  return () => root.removeEventListener("click", onClick);
}

/** Keep getting a drag's moves outside the element. Best effort: a pointer that already ended can't be captured. */
export function capture(el: Element, pointerId: number) {
  try {
    el.setPointerCapture(pointerId);
  } catch {}
}

const sizes = new Map<string, { w: number; h: number }>();
/** Natural size of a photo, loading it if needed. */
function measure(src: string): Promise<{ w: number; h: number }> {
  const known = sizes.get(src);
  if (known) return Promise.resolve(known);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const s = { w: img.naturalWidth || 1000, h: img.naturalHeight || 1000 };
      sizes.set(src, s);
      resolve(s);
    };
    img.onerror = () => resolve({ w: 1000, h: 1000 });
    img.src = src;
  });
}

export async function openInspect(opts: InspectOptions) {
  const getFeel = opts.feel ?? (() => "calm" as Feel);
  const instant = prefersReducedMotion();
  const many = opts.photos.length > 1;
  let index = opts.index;
  let source = opts.source(index);
  const from = source?.getBoundingClientRect() ?? null;
  let nat = await measure(opts.photos[index].src);
  opts.photos.forEach((p) => void measure(p.src)); // warm the rest

  const shade = document.createElement("div");
  shade.setAttribute("role", "dialog");
  shade.setAttribute("aria-modal", "true");
  shade.setAttribute("aria-label", "Product photos");
  Object.assign(shade.style, {
    position: "fixed",
    inset: "0",
    zIndex: "70",
    background: "color-mix(in srgb, var(--bg, #000) 94%, transparent)",
    backdropFilter: "blur(6px)",
    opacity: "0",
    touchAction: "none",
    cursor: "grab",
    overflow: "hidden",
  });
  const makePic = () => {
    const el = document.createElement("img");
    el.draggable = false;
    Object.assign(el.style, { position: "fixed", left: "0", top: "0", maxWidth: "none", transformOrigin: "0 0", willChange: "transform", userSelect: "none" });
    return el;
  };
  const pic = makePic();
  const setPic = () => {
    pic.src = opts.photos[index].src;
    pic.alt = opts.photos[index].alt;
    pic.style.width = `${nat.w}px`;
    pic.style.height = `${nat.h}px`;
  };
  setPic();
  if (source) pic.style.borderRadius = getComputedStyle(source).borderRadius;

  const button = (label: string, text: string, style: Partial<CSSStyleDeclaration>) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = text;
    b.setAttribute("aria-label", label);
    b.className = "shop-buy";
    Object.assign(b.style, { position: "fixed", zIndex: "71", width: "auto", fontSize: "0.95rem", ...style });
    return b;
  };
  const close = button("Close", "Close", { top: "16px", right: "16px", padding: "0.55rem 1.2rem" });
  const prev = button("Previous photo", "←", { left: "16px", top: "50%", padding: "0.5rem 0.9rem" });
  const next = button("Next photo", "→", { right: "16px", top: "50%", padding: "0.5rem 0.9rem" });
  const hint = document.createElement("p");
  hint.setAttribute("aria-live", "polite");
  Object.assign(hint.style, { position: "fixed", bottom: "18px", left: "0", right: "0", textAlign: "center", fontSize: "13px", opacity: "0.65", color: "var(--text, #fff)" });
  const caption = () => {
    hint.textContent = many
      ? `${index + 1} of ${opts.photos.length} · swipe for more · double-tap to zoom · swipe down to close`
      : "Drag to look around · double-tap to zoom · swipe down to close";
    prev.style.visibility = index > 0 ? "visible" : "hidden";
    next.style.visibility = index < opts.photos.length - 1 ? "visible" : "hidden";
  };
  caption();
  shade.append(pic, close, ...(many ? [prev, next] : []), hint);
  // Inside the shop, so its palette variables apply. Nothing between it and the page root is
  // transformed, so position: fixed still means the viewport.
  (source?.closest<HTMLElement>(".shop") ?? document.querySelector<HTMLElement>(".shop") ?? document.body).append(shade);
  const prevOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = "hidden";
  if (source) source.style.visibility = "hidden";
  close.focus({ preventScroll: true });

  // Position is the picture's top-left corner; scale is relative to its natural size.
  const fit = () => Math.min((innerWidth * 0.92) / nat.w, (innerHeight * 0.84) / nat.h, 1.6);
  const centre = (s: number) => ({ x: (innerWidth - nat.w * s) / 2, y: (innerHeight - nat.h * s) / 2 });
  const start = from ? { x: from.left, y: from.top, s: from.width / nat.w } : { ...centre(fit() * 0.92), s: fit() * 0.92 };
  const x = new Spring(start.x);
  const y = new Spring(start.y);
  const s = new Spring(start.s);
  const fade = new Spring(0);
  const home = () => {
    const f = fit();
    const c = centre(f);
    s.target = f;
    x.target = c.x;
    y.target = c.y;
  };
  home();
  fade.target = 1;
  if (instant) [x, y, s, fade].forEach((sp) => sp.snap(sp.target));

  // The photo being paged away keeps moving on its own spring until it's off screen.
  let ghost: { el: HTMLImageElement; x: Spring; y: number; s: number } | null = null;

  let closing = false;
  let drag: { px: number; py: number; x: number; y: number; t: number; vx: number; vy: number; axis: "x" | "y" | null } | null = null;
  let lastTap = 0;
  let raf = 0;
  let last = performance.now();

  async function go(to: number, vx = 0) {
    if (to < 0 || to >= opts.photos.length || to === index || closing) return home();
    const dir = Math.sign(to - index);
    // The current photo slides out; the next comes in from the other side with the same speed.
    ghost?.el.remove();
    const el = pic.cloneNode() as HTMLImageElement;
    shade.insertBefore(el, pic);
    ghost = { el, x: new Spring(x.x), y: y.x, s: s.x };
    ghost.x.v = vx;
    ghost.x.target = dir > 0 ? -nat.w * s.x - 40 : innerWidth + 40;
    if (source) source.style.visibility = "";
    index = to;
    nat = await measure(opts.photos[index].src);
    setPic();
    opts.onIndex?.(index);
    source = opts.source(index);
    if (source) source.style.visibility = "hidden";
    caption();
    const f = fit();
    s.snap(f);
    x.snap(dir > 0 ? innerWidth + 40 : -nat.w * f - 40);
    x.v = vx;
    y.snap(centre(f).y);
    home();
    if (instant) {
      [x, y, s].forEach((sp) => sp.snap(sp.target));
      ghost.el.remove();
      ghost = null;
    }
  }

  const dismiss = () => {
    if (closing) return;
    closing = true;
    ghost?.el.remove();
    ghost = null;
    const to = source?.getBoundingClientRect(); // the page may have moved; land where it is now
    if (to && to.width > 0) {
      x.target = to.left;
      y.target = to.top;
      s.target = to.width / nat.w;
    } else {
      s.target = s.x * 0.9; // nowhere to land: settle back and fade
    }
    fade.target = 0;
    if (instant) [x, y, s, fade].forEach((sp) => sp.snap(sp.target));
  };

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const spring = SPRING[getFeel()];
    if (!drag) {
      x.step(dt, spring);
      y.step(dt, spring);
    }
    s.step(dt, spring);
    fade.step(dt, spring);
    if (ghost) {
      ghost.x.step(dt, spring);
      ghost.el.style.transform = `translate3d(${ghost.x.x}px,${ghost.y}px,0) scale(${ghost.s})`;
      if (ghost.x.settled) {
        ghost.el.remove();
        ghost = null;
      }
    }
    // Dragging down fades the backdrop: you see the page you're about to return to.
    const pull = drag?.axis === "y" && s.target <= fit() * 1.01 ? clamp((y.x - centre(s.x).y) / innerHeight, 0, 1) : 0;
    shade.style.opacity = String(clamp(fade.x, 0, 1) * (1 - pull * 1.4));
    pic.style.transform = `translate3d(${x.x}px,${y.x}px,0) scale(${s.x})`;
    for (const el of [close, prev, next, hint]) el.style.opacity = String(clamp(fade.x, 0, 1) * (closing ? 0 : 1));
    if (closing && x.settled && y.settled && s.settled && fade.settled) return finish();
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  function finish() {
    cancelAnimationFrame(raf);
    if (source) source.style.visibility = "";
    shade.remove();
    document.documentElement.style.overflow = prevOverflow;
    removeEventListener("keydown", onKey);
    removeEventListener("resize", onResize);
    source?.closest<HTMLElement>("[tabindex]")?.focus({ preventScroll: true });
  }

  const zoomed = () => s.target > fit() * 1.01;
  const onDown = (e: PointerEvent) => {
    if ((e.target as Element).closest("button") || closing) return;
    capture(shade, e.pointerId);
    shade.style.cursor = "grabbing";
    drag = { px: e.clientX, py: e.clientY, x: x.x, y: y.x, t: performance.now(), vx: 0, vy: 0, axis: zoomed() ? "x" : null };
    const now = performance.now();
    if (now - lastTap < 300) zoomAt(e.clientX, e.clientY);
    lastTap = now;
  };
  const onMove = (e: PointerEvent) => {
    if (!drag) return;
    const dx = e.clientX - drag.px;
    const dy = e.clientY - drag.py;
    // Decide once whether this is a sideways swipe (next photo) or a pull down (close).
    if (!drag.axis && Math.hypot(dx, dy) > 8) drag.axis = many && Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    if (!drag.axis) return;
    const now = performance.now();
    const free = zoomed();
    const nx = drag.x + (free || drag.axis === "x" ? dx : 0);
    const ny = drag.y + (free || drag.axis === "y" ? dy : 0);
    const dtm = Math.max(1, now - drag.t) / 1000;
    drag.vx = (nx - x.x) / dtm;
    drag.vy = (ny - y.x) / dtm;
    drag.t = now;
    x.x = nx;
    y.x = ny;
  };
  const onUp = () => {
    if (!drag) return;
    const { vx, vy, axis } = drag;
    shade.style.cursor = "grab";
    drag = null;
    if (zoomed()) {
      // Keep the zoomed picture covering the screen.
      const w = nat.w * s.target;
      const h = nat.h * s.target;
      x.target = clamp(x.x, Math.min(0, innerWidth - w), Math.max(0, (innerWidth - w) / 2));
      y.target = clamp(y.x, Math.min(0, innerHeight - h), Math.max(0, (innerHeight - h) / 2));
      return;
    }
    const off = { x: x.x - centre(s.x).x, y: y.x - centre(s.x).y };
    if (axis === "x" && (off.x < -innerWidth * 0.15 || vx < -500)) return void go(index + 1, vx);
    if (axis === "x" && (off.x > innerWidth * 0.15 || vx > 500)) return void go(index - 1, vx);
    if (axis === "y" && (off.y > innerHeight * 0.18 || vy > 900)) return dismiss();
    home();
  };
  function zoomAt(cx: number, cy: number) {
    const f = fit();
    if (zoomed()) return home();
    const z = Math.max(f * 1.8, 1);
    // Keep the tapped point under the finger.
    x.target = cx - ((cx - x.x) / s.x) * z;
    y.target = cy - ((cy - y.x) / s.x) * z;
    s.target = z;
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") dismiss();
    if (e.key === "ArrowRight") void go(index + 1);
    if (e.key === "ArrowLeft") void go(index - 1);
  };
  const onResize = () => !closing && home();

  shade.addEventListener("pointerdown", onDown);
  shade.addEventListener("pointermove", onMove);
  shade.addEventListener("pointerup", onUp);
  shade.addEventListener("pointercancel", onUp);
  close.addEventListener("click", dismiss);
  prev.addEventListener("click", () => void go(index - 1));
  next.addEventListener("click", () => void go(index + 1));
  addEventListener("keydown", onKey);
  addEventListener("resize", onResize);
}
