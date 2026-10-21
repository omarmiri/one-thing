"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion, Spring, SPRING, type Feel } from "./springs";

// Once the buy button at the top has scrolled away, a slim bar rises from the bottom edge with
// the product, its price and the checkout button itself (PayPal), so buying is one tap from
// anywhere. It steps aside when the closing buy section is on screen, so there is never more
// than one buy button in view.

export function StickyBuy({
  name,
  price,
  image,
  cta,
  buy,
  feel = "calm",
}: {
  name: string;
  price: string;
  image: string | null;
  cta: string;
  buy?: ReactNode; // the page's checkout button; without one, the bar links to the buy section
  feel?: Feel;
}) {
  const bar = useRef<HTMLDivElement>(null);
  const feelRef = useRef(feel);
  useEffect(() => {
    feelRef.current = feel;
  }, [feel]);

  useEffect(() => {
    const top = document.querySelector("[data-buy='hero']");
    const bottom = document.getElementById("buy");
    // Read every frame rather than observed: a restored scroll position can jump past an
    // observer's first report, and two rects a frame cost nothing.
    const needed = () => {
      const above = !top || top.getBoundingClientRect().bottom < 0;
      const b = bottom?.getBoundingClientRect();
      const closingInView = b ? b.top < innerHeight && b.bottom > 0 : false;
      return above && !closingInView;
    };

    const y = new Spring(1); // 1 = tucked below the edge, 0 = showing
    const still = prefersReducedMotion();
    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      y.target = needed() ? 0 : 1;
      if (still) y.snap(y.target);
      y.step(dt, SPRING[feelRef.current]);
      if (bar.current) {
        bar.current.style.transform = `translate3d(0, ${(y.x * 130).toFixed(2)}%, 0)`;
        bar.current.style.visibility = y.x > 0.99 && y.target === 1 ? "hidden" : "visible";
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={bar} className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3" style={{ transform: "translate3d(0,130%,0)", visibility: "hidden" }}>
      <div className="shop-card mx-auto flex max-w-3xl items-center gap-3 p-2 pr-2 shadow-2xl" style={{ padding: "0.5rem" }}>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element -- seller's photo
          <img src={image} alt="" className="size-11 shrink-0 rounded-lg object-cover" />
        )}
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate font-semibold">{name}</p>
          <p className="text-sm" style={{ color: "var(--muted)" }}>{price}</p>
        </div>
        {buy ? (
          <div className="w-40 shrink-0 sm:w-56">{buy}</div>
        ) : (
        <a
          href="#buy"
          className="shop-buy shrink-0"
          style={{ width: "auto", padding: "0.6rem 1.25rem", fontSize: "0.95rem" }}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("buy")?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
        >
          {cta}
        </a>
        )}
      </div>
    </div>
  );
}
