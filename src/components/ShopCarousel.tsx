"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type CarouselShop = { slug: string; name: string; image: string | null; background: string; text: string };

// A strip of small product photos paged with arrows, like a "browsing history" row:
// each arrow moves one visible width, and the counter says which page you're on.
export function ShopCarousel({ shops }: { shops: CarouselShop[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const total = Math.max(1, Math.ceil((el.scrollWidth - 1) / el.clientWidth));
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
    setPages(total);
    setPage(atEnd ? total : Math.min(total, Math.floor(el.scrollLeft / el.clientWidth + 0.5) + 1));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const go = (dir: -1 | 1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };
  const restart = () => track.current?.scrollTo({ left: 0, behavior: "smooth" });

  const arrow =
    "hidden size-10 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-xl text-muted shadow-sm transition hover:text-foreground disabled:opacity-30 sm:flex";

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-3">
        <h2 className="text-lg font-bold tracking-tight">Made with OneThing</h2>
        <Link href="/gallery" className="text-sm text-accent hover:underline">
          See the gallery
        </Link>
        {pages > 1 && (
          <span className="ml-auto text-sm text-muted">
            Page {page} of {pages}
            {page > 1 && (
              <>
                <span className="mx-2 text-line">|</span>
                <button onClick={restart} className="text-accent hover:underline">
                  Start over
                </button>
              </>
            )}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button aria-label="Previous" onClick={() => go(-1)} disabled={page <= 1} className={arrow}>
          ‹
        </button>
        <div
          ref={track}
          onScroll={measure}
          className="flex flex-1 snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {shops.map((s) => (
            <Link
              key={s.slug}
              href={`/${s.slug}`}
              title={s.name}
              className="group size-24 shrink-0 snap-start overflow-hidden rounded-lg border border-black/5 sm:size-28"
              style={{ background: s.background, color: s.text }}
            >
              {s.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.image} alt={s.name} loading="lazy" className="size-full object-cover transition duration-300 group-hover:scale-105" />
              ) : (
                <span className="flex size-full items-center justify-center p-2 text-center text-xs font-semibold leading-tight">{s.name}</span>
              )}
            </Link>
          ))}
        </div>
        <button aria-label="Next" onClick={() => go(1)} disabled={page >= pages} className={arrow}>
          ›
        </button>
      </div>
    </div>
  );
}
