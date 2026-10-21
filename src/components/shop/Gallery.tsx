"use client";

import { useEffect, useRef, useState } from "react";
import { capture, openInspect } from "@/components/motion/inspect";
import { clamp, prefersReducedMotion, Spring, SPRING } from "@/components/motion/springs";

// The product photos as one strip on a spring. Drag or swipe and it follows the finger exactly,
// a flick carries it on, and it settles on the nearest photo; past the ends it resists. Tap a
// photo and it opens in Inspect, which pages through the same photos and hands back whichever
// one the buyer ended on. Arrows (on hover), dots and the keyboard do the same without a swipe.

export function Gallery({ photos, alt, frameClass = "", imgClass = "" }: { photos: string[]; alt: string; frameClass?: string; imgClass?: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const imgs = useRef<(HTMLImageElement | null)[]>([]);
  const ctl = useRef<{ goTo(i: number, instant?: boolean): void } | null>(null);
  const [index, setIndex] = useState(0);
  const n = photos.length;

  useEffect(() => {
    const el = frame.current!;
    const pos = new Spring(0); // in photos, 0 = first
    const still = prefersReducedMotion();
    let raf = 0;
    let last = 0;
    let drag: { x: number; y: number; pos: number; t: number; v: number; axis: "x" | "y" | null; moved: boolean } | null = null;
    let shown = 0;

    const draw = () => {
      if (track.current) track.current.style.transform = `translate3d(${(-pos.x * el.clientWidth).toFixed(2)}px,0,0)`;
      const i = clamp(Math.round(pos.x), 0, n - 1);
      if (i !== shown) setIndex((shown = i));
    };
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!drag) pos.step(dt, SPRING.crisp);
      draw();
      raf = drag || !pos.settled ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const goTo = (i: number, instant = false) => {
      pos.target = clamp(i, 0, n - 1);
      if (instant || still) pos.snap(pos.target);
      draw();
      kick();
    };
    ctl.current = { goTo };

    const onDown = (e: PointerEvent) => {
      if ((e.target as Element).closest("[data-nav]")) return;
      drag = { x: e.clientX, y: e.clientY, pos: pos.x, t: performance.now(), v: 0, axis: null, moved: false };
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      if (!drag.axis && Math.hypot(dx, dy) > 6) {
        // Vertical means the buyer is scrolling the page: let it go.
        drag.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        if (drag.axis === "y") return void (drag = null);
        capture(el, e.pointerId);
        kick();
      }
      if (drag.axis !== "x") return;
      drag.moved = true;
      let p = drag.pos - dx / el.clientWidth;
      if (p < 0) p *= 0.35; // resist past the first photo…
      if (p > n - 1) p = n - 1 + (p - (n - 1)) * 0.35; // …and the last
      const now = performance.now();
      drag.v = (p - pos.x) / (Math.max(1, now - drag.t) / 1000);
      drag.t = now;
      pos.x = p;
    };
    const onUp = () => {
      if (!drag) return;
      const { moved, v, pos: from } = drag;
      drag = null;
      if (!moved) return;
      // A flick moves one photo even if it was short; never more than one per swipe.
      const base = Math.round(from);
      const aim = Math.round(pos.x + clamp(v * 0.18, -0.6, 0.6));
      pos.v = v;
      goTo(clamp(aim, base - 1, base + 1));
    };
    // A drag that moved isn't a tap: swallow the click it ends with.
    const onClick = (e: MouseEvent) => {
      if (Math.abs(pos.x - pos.target) > 0.02) e.stopPropagation();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(Math.round(pos.target) + 1);
      else if (e.key === "ArrowLeft") goTo(Math.round(pos.target) - 1);
      else return;
      e.preventDefault();
    };
    const onResize = () => draw();

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("click", onClick, true);
    el.addEventListener("keydown", onKey);
    addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("click", onClick, true);
      el.removeEventListener("keydown", onKey);
      removeEventListener("resize", onResize);
    };
  }, [n]);

  const inspect = (i: number) =>
    openInspect({
      photos: photos.map((src, k) => ({ src, alt: `${alt} (photo ${k + 1} of ${n})` })),
      index: i,
      source: (k) => imgs.current[k] ?? null,
      onIndex: (k) => ctl.current?.goTo(k, true), // the page follows, so closing lands on the same photo
    });

  const arrow = "absolute top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-lg text-black shadow-md opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 disabled:hidden";

  return (
    <div
      ref={frame}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${alt}: ${n} photos`}
      className={`group relative overflow-hidden outline-none ${frameClass}`}
      style={{ touchAction: "pan-y" }}
    >
      <div ref={track} className="flex h-full will-change-transform">
        {photos.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => inspect(i)}
            aria-label={`Look closer at photo ${i + 1} of ${n}`}
            className="h-full w-full shrink-0 cursor-zoom-in"
            tabIndex={i === index ? 0 : -1}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- seller's photos, served from our DB */}
            <img
              ref={(el) => {
                imgs.current[i] = el;
              }}
              src={src}
              alt={i === 0 ? alt : `${alt} (photo ${i + 1})`}
              loading={i === 0 ? "eager" : "lazy"}
              draggable={false}
              className={`pointer-events-none size-full select-none ${imgClass}`}
            />
          </button>
        ))}
      </div>
      <button type="button" data-nav aria-label="Previous photo" disabled={index === 0} onClick={() => ctl.current?.goTo(index - 1)} className={`${arrow} left-3`}>
        ←
      </button>
      <button type="button" data-nav aria-label="Next photo" disabled={index === n - 1} onClick={() => ctl.current?.goTo(index + 1)} className={`${arrow} right-3`}>
        →
      </button>
      <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center">
        <div data-nav className="flex gap-1.5 rounded-full bg-black/35 px-2.5 py-1.5 backdrop-blur">
          {photos.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Show photo ${i + 1} of ${n}`}
              aria-current={i === index}
              onClick={() => ctl.current?.goTo(i)}
              className={`size-1.5 rounded-full transition-all ${i === index ? "w-4 bg-white" : "bg-white/55"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
