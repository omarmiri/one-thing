import { clamp, prefersReducedMotion, Spring, SPRING, type Feel } from "./springs";

// The motion layer, in the spirit of Famo.us: CSS still lays the page out, and every element
// marked data-surface becomes a body whose offset from that resting place is driven by springs.
// The choreography is deliberately quiet: each surface rises into place once, the first time it
// scrolls into view, and the product photo has a little depth (a slow parallax and a tilt that
// follows the pointer). Nothing loops, nothing bounces, nothing moves without a reason.

type Body = {
  el: HTMLElement;
  role: string;
  rest: { y: number; h: number }; // document coordinates, untransformed
  y: Spring;
  o: Spring;
  s: Spring;
  rx: Spring;
  ry: Spring;
  shownAt: number | null;
};

export type Motion = { setFeel(f: Feel): void; replay(): void; destroy(): void };

const HIDDEN = { y: 28, o: 0, s: 0.985 };
const HIDDEN_IMAGE = { y: 44, o: 0, s: 0.96 };

export function createMotion(root: HTMLElement, initialFeel: Feel): Motion {
  let feel = initialFeel;
  let bodies: Body[] = [];
  let t = 0;
  let last = performance.now();
  let raf = 0;
  let needsMeasure = false;
  const pointer = { nx: 0, ny: 0, tx: 0, ty: 0 };
  const still = prefersReducedMotion();

  function collect() {
    bodies = [...root.querySelectorAll<HTMLElement>("[data-surface]")].map((el) => {
      const role = el.dataset.surface || "text";
      const h = role === "image" ? HIDDEN_IMAGE : HIDDEN;
      el.style.willChange = "transform, opacity";
      return { el, role, rest: { y: 0, h: 0 }, y: new Spring(h.y), o: new Spring(h.o), s: new Spring(h.s), rx: new Spring(0), ry: new Spring(0), shownAt: null };
    });
    measure();
  }

  /** Resting places, read with transforms off so motion never feeds back into layout. */
  function measure() {
    for (const b of bodies) b.el.style.transform = "none";
    for (const b of bodies) {
      const r = b.el.getBoundingClientRect();
      b.rest = { y: r.top + scrollY, h: r.height };
    }
    for (const b of bodies) write(b);
  }

  function write(b: Body) {
    b.el.style.transform =
      `perspective(1400px) translate3d(0,${b.y.x.toFixed(2)}px,0) ` +
      `rotateX(${b.rx.x.toFixed(3)}deg) rotateY(${b.ry.x.toFixed(3)}deg) scale(${b.s.x.toFixed(4)})`;
    b.el.style.opacity = String(clamp(b.o.x, 0, 1));
  }

  function frame(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    t += dt;
    if (needsMeasure) {
      needsMeasure = false;
      measure();
    }
    const vh = innerHeight;
    pointer.nx += (pointer.tx - pointer.nx) * Math.min(1, dt * 4);
    pointer.ny += (pointer.ty - pointer.ny) * Math.min(1, dt * 4);

    // Surfaces that arrive together are revealed in reading order, a beat apart.
    let batch = 0;
    const spring = SPRING[feel];
    for (const b of bodies) {
      const top = b.rest.y - scrollY;
      if (b.shownAt === null && top < vh * 0.9 && top + b.rest.h > 0) b.shownAt = t + Math.min(0.5, 0.07 * batch++);
      else if (b.shownAt === null && top + b.rest.h <= 0) b.shownAt = t; // already scrolled past
      const shown = b.shownAt !== null && t >= b.shownAt;
      const hidden = b.role === "image" ? HIDDEN_IMAGE : HIDDEN;

      if (b.role === "image" && shown) {
        // Depth for the product: it drifts a little slower than the page, and turns toward the pointer.
        const p = clamp((top + b.rest.h / 2 - vh / 2) / vh, -1, 1);
        b.y.target = p * -24;
        b.rx.target = -pointer.ny * 3;
        b.ry.target = pointer.nx * 4;
      } else {
        b.y.target = shown ? 0 : hidden.y;
      }
      b.o.target = shown ? 1 : hidden.o;
      b.s.target = shown ? 1 : hidden.s;
      for (const s of [b.y, b.o, b.s, b.rx, b.ry]) s.step(dt, spring);
      write(b);
    }
    raf = requestAnimationFrame(frame);
  }

  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return; // tilt is a desktop nicety; touch scrolls
    pointer.tx = (e.clientX / innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / innerHeight) * 2 - 1;
  };
  const onResize = () => (needsMeasure = true);

  root.dataset.motion = "on";
  if (still) {
    // Reduced motion: everything simply where it belongs.
    return { setFeel() {}, replay() {}, destroy() {} };
  }
  addEventListener("pointermove", onPointer);
  addEventListener("resize", onResize);
  // Fonts and images arriving late move the layout under us.
  const ro = new ResizeObserver(onResize);
  ro.observe(root);
  document.fonts?.ready.then(onResize);
  collect();
  raf = requestAnimationFrame(frame);

  return {
    setFeel(f) {
      feel = f;
    },
    replay() {
      for (const b of bodies) {
        const h = b.role === "image" ? HIDDEN_IMAGE : HIDDEN;
        b.y.snap(h.y);
        b.o.snap(h.o);
        b.s.snap(h.s);
        b.shownAt = null;
      }
    },
    destroy() {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onPointer);
      removeEventListener("resize", onResize);
      ro.disconnect();
      for (const b of bodies) {
        b.el.style.transform = "";
        b.el.style.opacity = "";
      }
    },
  };
}
