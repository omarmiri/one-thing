"use client";

import { useEffect, useRef } from "react";
import { clamp, prefersReducedMotion, Spring, SPRING, type Feel } from "./springs";

// The story and the feature bullets, told one at a time beside the product, which stays in
// view. Each step brings the camera a little closer and moves the light across the product, so
// reading on feels like looking closer. The step nearest the middle of the screen is the
// current one; the rest wait, dimmed. It's the same content as the plain layout, in order.

export function FeatureStory({
  story,
  bullets,
  image,
  imageAlt,
  feel = "calm",
  melt = false,
}: {
  story: string;
  bullets: string[];
  image: string | null;
  imageAlt: string;
  feel?: Feel;
  /** Multiply-blend the photo so a white studio backdrop takes on the card's colour. Light cards only. */
  melt?: boolean;
}) {
  const steps = useRef<(HTMLDivElement | null)[]>([]);
  const pic = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);
  const dots = useRef<(HTMLSpanElement | null)[]>([]);
  const feelRef = useRef(feel);
  useEffect(() => {
    feelRef.current = feel;
  }, [feel]);

  useEffect(() => {
    const n = bullets.length + 1; // the story paragraph is step 0
    const fade = Array.from({ length: n }, (_, i) => new Spring(i === 0 ? 1 : 0.25));
    const zoom = new Spring(1);
    const lx = new Spring(30);
    const ly = new Spring(25);
    const still = prefersReducedMotion();
    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // The current step: the one whose middle is nearest a line just above the screen's middle.
      const line = innerHeight * 0.45;
      let active = 0;
      let best = Infinity;
      steps.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - line);
        if (d < best) {
          best = d;
          active = i;
        }
      });
      const spring = SPRING[feelRef.current];
      fade.forEach((f, i) => {
        f.target = i === active ? 1 : 0.22;
        if (still) f.snap(f.target);
        f.step(dt, spring);
        const el = steps.current[i];
        if (el) {
          el.style.opacity = String(clamp(f.x, 0, 1));
          el.style.transform = `translate3d(0,${((1 - f.x) * 10).toFixed(2)}px,0)`;
        }
        const dot = dots.current[i];
        if (dot) {
          dot.style.transform = `scaleY(${(0.35 + f.x * 0.65).toFixed(3)})`;
          dot.style.opacity = String(0.3 + f.x * 0.7);
        }
      });
      // Closer with every step, and the light walks across the product.
      zoom.target = 1 + (active / Math.max(1, n - 1)) * 0.08;
      lx.target = 25 + (active % 2 ? 45 : 10) + active * 3;
      ly.target = 20 + (active / Math.max(1, n - 1)) * 45;
      for (const s of [zoom, lx, ly]) {
        if (still) s.snap(s.target);
        s.step(dt, spring);
      }
      if (pic.current) pic.current.style.transform = `scale(${zoom.x.toFixed(4)})`;
      if (light.current)
        light.current.style.background = `radial-gradient(60% 55% at ${lx.x.toFixed(1)}% ${ly.x.toFixed(1)}%, rgba(255,255,255,0.22), transparent 70%)`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [bullets.length]);

  const paragraphs = story.split(/\n\s*\n/);

  return (
    <section className={`py-10 md:py-16 ${image ? "md:grid md:grid-cols-[1.05fr_1fr] md:gap-14" : ""}`}>
      {image && (
        <div className="sticky top-3 z-10 md:top-[12vh] md:self-start" style={{ background: "var(--bg)" }}>
          <div data-inspect className="shop-card relative overflow-hidden" style={{ padding: 0 }}>
            {/* The card colour sits on the zooming layer itself: a multiply blend needs something to blend with. */}
            <div ref={pic} className="will-change-transform" style={{ background: "var(--surface)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- seller's photo, served from our DB */}
              <img
                src={image}
                alt={imageAlt}
                className="block h-[38vh] w-full object-contain p-6 md:h-[70vh] md:p-10"
                style={melt ? { mixBlendMode: "multiply" } : undefined}
              />
            </div>
            <div ref={light} aria-hidden className="pointer-events-none absolute inset-0 mix-blend-soft-light" />
          </div>
          <div aria-hidden className="mt-3 hidden justify-center gap-1.5 md:flex">
            {Array.from({ length: bullets.length + 1 }, (_, i) => (
              <span
                key={i}
                ref={(el) => {
                  dots.current[i] = el;
                }}
                className="block h-4 w-1 origin-center rounded-full"
                style={{ background: "var(--accent)" }}
              />
            ))}
          </div>
        </div>
      )}
      <div>
        <div
          ref={(el) => {
            steps.current[0] = el;
          }}
          className="flex min-h-[46vh] flex-col justify-center space-y-5 py-8 text-lg leading-relaxed md:min-h-[62vh]"
        >
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {bullets.map((b, i) => (
          <div
            key={i}
            ref={(el) => {
              steps.current[i + 1] = el;
            }}
            className="flex min-h-[46vh] flex-col justify-center py-8 md:min-h-[62vh]"
          >
            <p className="mb-3 text-sm font-semibold tabular-nums tracking-[0.2em]" style={{ color: "var(--accent)" }}>
              {String(i + 1).padStart(2, "0")}
            </p>
            <p className="shop-heading text-3xl leading-tight md:text-4xl">{b}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
