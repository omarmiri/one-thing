import { clamp, prefersReducedMotion, Spring, SPRING, type Feel } from "./springs";

// Inspect: tap the product photo and that same photo grows out of the page to fill the screen
// (a shared-element transition, not a modal that pops in). Drag to look around; flick or drag it
// down and it falls back into its place. Double-tap zooms to where you tapped. Esc closes.

export function attachInspect(root: HTMLElement, getFeel: () => Feel): () => void {
  const onClick = (e: MouseEvent) => {
    const img = (e.target as Element).closest?.("[data-inspect] img, img[data-inspect]") as HTMLImageElement | null;
    if (!img || !root.contains(img)) return;
    e.preventDefault();
    open(img, getFeel);
  };
  root.addEventListener("click", onClick);
  for (const img of root.querySelectorAll<HTMLElement>("[data-inspect] img, img[data-inspect]")) img.style.cursor = "zoom-in";
  return () => root.removeEventListener("click", onClick);
}

function open(img: HTMLImageElement, getFeel: () => Feel) {
  const from = img.getBoundingClientRect();
  const natW = img.naturalWidth || from.width;
  const natH = img.naturalHeight || from.height;
  const instant = prefersReducedMotion();

  const shade = document.createElement("div");
  shade.setAttribute("role", "dialog");
  shade.setAttribute("aria-modal", "true");
  shade.setAttribute("aria-label", img.alt || "Product photo");
  Object.assign(shade.style, {
    position: "fixed",
    inset: "0",
    zIndex: "70",
    background: "color-mix(in srgb, var(--bg, #000) 94%, transparent)",
    backdropFilter: "blur(6px)",
    opacity: "0",
    touchAction: "none",
    cursor: "grab",
  });
  const pic = document.createElement("img");
  pic.src = img.currentSrc || img.src;
  pic.alt = img.alt;
  pic.draggable = false;
  Object.assign(pic.style, {
    position: "fixed",
    left: "0",
    top: "0",
    width: `${natW}px`,
    height: `${natH}px`,
    maxWidth: "none",
    transformOrigin: "0 0",
    willChange: "transform",
    userSelect: "none",
    borderRadius: getComputedStyle(img).borderRadius,
  });
  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "Close";
  close.className = "shop-buy";
  Object.assign(close.style, { position: "fixed", top: "16px", right: "16px", zIndex: "71", width: "auto", padding: "0.55rem 1.2rem", fontSize: "0.95rem" });
  const hint = document.createElement("p");
  hint.textContent = "Drag to look around · double-tap to zoom · swipe down to close";
  Object.assign(hint.style, { position: "fixed", bottom: "18px", left: "0", right: "0", textAlign: "center", fontSize: "13px", opacity: "0.65", color: "var(--text, #fff)" });
  shade.append(pic, close, hint);
  // Inside the shop, so the shop's palette variables apply. Nothing between it and the page root
  // is transformed, so position: fixed still means the viewport.
  (img.closest<HTMLElement>(".shop") ?? document.body).append(shade);
  const prevOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = "hidden";
  img.style.visibility = "hidden";
  close.focus({ preventScroll: true });

  // Position is the picture's top-left corner; scale is relative to its natural size.
  // Fill most of the screen, but never blow a small photo up past where it turns soft.
  const fit = () => Math.min((innerWidth * 0.92) / natW, (innerHeight * 0.84) / natH, 1.6);
  const centre = (s: number) => ({ x: (innerWidth - natW * s) / 2, y: (innerHeight - natH * s) / 2 });
  const x = new Spring(from.left);
  const y = new Spring(from.top);
  const s = new Spring(from.width / natW);
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

  let closing = false;
  let drag: { px: number; py: number; x: number; y: number; t: number; vx: number; vy: number } | null = null;
  let lastTap = 0;
  let raf = 0;
  let last = performance.now();

  const dismiss = () => {
    if (closing) return;
    closing = true;
    const to = img.getBoundingClientRect(); // the page may have reflowed; land where it is now
    x.target = to.left;
    y.target = to.top;
    s.target = to.width / natW;
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
    // Dragging down fades the backdrop: you can see the page you're about to return to.
    const pull = drag && s.target <= fit() * 1.01 ? clamp((y.x - centre(s.x).y) / innerHeight, 0, 1) : 0;
    shade.style.opacity = String(clamp(fade.x, 0, 1) * (1 - pull * 1.4));
    pic.style.transform = `translate3d(${x.x}px,${y.x}px,0) scale(${s.x})`;
    for (const el of [close, hint]) el.style.opacity = String(clamp(fade.x, 0, 1) * (closing ? 0 : 1));
    if (closing && x.settled && y.settled && s.settled) return finish();
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  function finish() {
    cancelAnimationFrame(raf);
    img.style.visibility = "";
    shade.remove();
    document.documentElement.style.overflow = prevOverflow;
    removeEventListener("keydown", onKey);
    removeEventListener("resize", onResize);
    img.focus?.({ preventScroll: true });
  }

  const onDown = (e: PointerEvent) => {
    if (e.target === close || closing) return;
    shade.setPointerCapture(e.pointerId);
    shade.style.cursor = "grabbing";
    drag = { px: e.clientX, py: e.clientY, x: x.x, y: y.x, t: performance.now(), vx: 0, vy: 0 };
    const now = performance.now();
    if (now - lastTap < 300) zoomAt(e.clientX, e.clientY);
    lastTap = now;
  };
  const onMove = (e: PointerEvent) => {
    if (!drag) return;
    const now = performance.now();
    const nx = drag.x + (e.clientX - drag.px);
    const ny = drag.y + (e.clientY - drag.py);
    const dtm = Math.max(1, now - drag.t) / 1000;
    drag.vx = (nx - x.x) / dtm;
    drag.vy = (ny - y.x) / dtm;
    drag.t = now;
    x.x = nx;
    y.x = ny;
  };
  const onUp = () => {
    if (!drag) return;
    const { vy } = drag;
    shade.style.cursor = "grab";
    drag = null;
    const zoomed = s.target > fit() * 1.01;
    if (!zoomed && (y.x - centre(s.x).y > innerHeight * 0.18 || vy > 900)) return dismiss();
    if (!zoomed) return home();
    // Zoomed in: keep the picture covering the screen, carry the flick's momentum a little.
    x.v = 0;
    y.v = 0;
    const w = natW * s.target;
    const h = natH * s.target;
    x.target = clamp(x.x, Math.min(0, innerWidth - w), Math.max(0, innerWidth - w) / 2 + 0);
    y.target = clamp(y.x, Math.min(0, innerHeight - h), Math.max(0, (innerHeight - h) / 2));
  };
  function zoomAt(cx: number, cy: number) {
    const f = fit();
    if (s.target > f * 1.01) return home();
    const z = Math.max(f * 1.8, 1);
    // Keep the tapped point under the finger.
    x.target = cx - ((cx - x.x) / s.x) * z;
    y.target = cy - ((cy - y.x) / s.x) * z;
    s.target = z;
  }
  const onKey = (e: KeyboardEvent) => e.key === "Escape" && dismiss();
  const onResize = () => !closing && home();

  shade.addEventListener("pointerdown", onDown);
  shade.addEventListener("pointermove", onMove);
  shade.addEventListener("pointerup", onUp);
  shade.addEventListener("pointercancel", onUp);
  close.addEventListener("click", dismiss);
  addEventListener("keydown", onKey);
  addEventListener("resize", onResize);
}
