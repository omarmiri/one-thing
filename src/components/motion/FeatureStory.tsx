"use client";

import { useEffect, useRef, useState } from "react";
import { openInspect } from "./inspect";
import { clamp, prefersReducedMotion, Spring, SPRING, type Feel } from "./springs";

// The story and the feature bullets, told one at a time beside the product, which stays in
// view. Each step brings the camera a little closer and moves the light across the product, so
// reading on feels like looking closer. The step nearest the middle of the screen is the
// current one; the rest wait, dimmed. It's the same content as the plain layout, in order.
// With several photos, each feature brings the next one, cross-fading in the pinned frame.

export function FeatureStory({
  story,
  bullets,
  image,
  photos,
  imageAlt,
  feel = "calm",
  melt = false,
}: {
  story: string;
  bullets: string[];
  image: string | null;
  photos?: string[]; // all product photos, cover first
  imageAlt: string;
  feel?: Feel;
  /** The card is light enough that a photo's white studio backdrop can melt into it (multiply). */
  melt?: boolean;
}) {
  const shots = photos?.length ? photos : image ? [image] : [];
  const imgs = useRef<(HTMLImageElement | null)[]>([]);
  const [studio, setStudio] = useState<Record<number, boolean>>({});
  // Which photo is in the frame: the current step's, unless the buyer paged to another in Inspect.
  const shown = useRef(0);
  const override = useRef<number | null>(null);
  const count = shots.length;
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
    const show = Array.from({ length: count }, (_, i) => new Spring(i === 0 ? 1 : 0));
    let lastActive = 0;
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
      if (active !== lastActive) {
        lastActive = active;
        override.current = null;
      }
      shown.current = override.current ?? active % Math.max(1, count);
      show.forEach((sp, i) => {
        sp.target = i === shown.current ? 1 : 0;
        if (still) sp.snap(sp.target);
        sp.step(dt, spring);
        const el = imgs.current[i];
        if (el) el.style.opacity = String(clamp(sp.x, 0, 1));
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
  }, [bullets.length, count]);

  // Which photos are studio shots. Checked once each has loaded; a cached photo can finish
  // loading before hydration, when an onLoad handler would never hear about it.
  useEffect(() => {
    if (!melt) return;
    const offs = imgs.current.slice(0, count).map((el, i) => {
      if (!el) return () => {};
      const check = () => {
        const white = studioShot(el);
        setStudio((m) => (m[i] === white ? m : { ...m, [i]: white }));
      };
      if (el.complete && el.naturalWidth) check();
      el.addEventListener("load", check);
      return () => el.removeEventListener("load", check);
    });
    return () => offs.forEach((off) => off());
  }, [melt, count]);

  const inspect = () =>
    openInspect({
      photos: shots.map((src, k) => ({ src, alt: shots.length > 1 ? `${imageAlt} (photo ${k + 1} of ${shots.length})` : imageAlt })),
      index: shown.current,
      source: (k) => imgs.current[k] ?? null,
      onIndex: (k) => {
        override.current = k; // the frame follows, so closing lands on the same photo
      },
      feel: () => feelRef.current,
    });

  const paragraphs = story.split(/\n\s*\n/);

  return (
    <section className={`py-10 md:py-16 ${shots.length ? "md:grid md:grid-cols-[1.05fr_1fr] md:gap-14" : ""}`}>
      {shots.length > 0 && (
        <div className="sticky top-3 z-10 md:top-[12vh] md:self-start" style={{ background: "var(--bg)" }}>
          <button
            type="button"
            onClick={inspect}
            aria-label={shots.length > 1 ? `Look closer: ${shots.length} photos` : "Look closer"}
            className="shop-card relative block w-full cursor-zoom-in overflow-hidden text-left"
            style={{ padding: 0 }}
          >
            {/* The card colour sits on the zooming layer itself: a multiply blend needs something to blend with. */}
            <div ref={pic} className="relative will-change-transform" style={{ background: "var(--surface)" }}>
              {shots.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element -- seller's photos, served from our DB
                <img
                  key={src}
                  ref={(el) => {
                    imgs.current[i] = el;
                  }}
                  src={src}
                  alt={i === 0 ? imageAlt : ""}
                  loading={i === 0 ? "eager" : "lazy"}
                  className={`h-[38vh] w-full object-contain p-6 md:h-[70vh] md:p-10 ${i === 0 ? "block" : "absolute inset-0"}`}
                  style={{ opacity: i === 0 ? 1 : 0, mixBlendMode: studio[i] ? "multiply" : undefined }}
                />
              ))}
            </div>
            <div ref={light} aria-hidden className="pointer-events-none absolute inset-0 mix-blend-soft-light" />
          </button>
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

/**
 * A studio shot: the photo's corners are near-white, so it was taken on a white backdrop and can
 * melt into a light card. Photos of the product in a real scene keep their own colours.
 */
function studioShot(img: HTMLImageElement): boolean {
  try {
    const c = document.createElement("canvas");
    c.width = c.height = 32;
    const g = c.getContext("2d", { willReadFrequently: true })!;
    g.drawImage(img, 0, 0, 32, 32);
    const px = g.getImageData(0, 0, 32, 32).data;
    const corner = (x0: number, y0: number) => {
      let sum = 0;
      for (let y = y0; y < y0 + 4; y++) for (let x = x0; x < x0 + 4; x++) for (let k = 0; k < 3; k++) sum += px[(y * 32 + x) * 4 + k];
      return sum / 48;
    };
    // Three white corners is enough: a product's shadow often reaches one of them.
    return [corner(0, 0), corner(28, 0), corner(0, 28), corner(28, 28)].filter((v) => v > 236).length >= 3;
  } catch {
    return false;
  }
}
