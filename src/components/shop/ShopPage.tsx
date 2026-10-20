import type { CSSProperties, ReactNode } from "react";
import { fontsHref, type DesignSpec } from "@/lib/design";

// Renders a design spec. Server component, no client JS except the buy button passed in.

export type ShopView = {
  spec: DesignSpec;
  priceLabel: string;
  shippingLabel: string | null; // null for digital
  shipCountries: string | null;
  stock: number | null;
  photoUrl: string | null;
  heroUrl: string | null;
};

export function ShopPage({ view, buy }: { view: ShopView; buy: ReactNode }) {
  const { spec } = view;
  const p = spec.palette;
  const vars = {
    "--bg": p.background,
    "--surface": p.surface,
    "--text": p.text,
    "--muted": p.muted,
    "--accent": p.accent,
    "--accent-text": p.accentText,
    "--font-h": `"${spec.fonts.heading}", Georgia, serif`,
    "--font-b": `"${spec.fonts.body}", system-ui, sans-serif`,
  } as CSSProperties;

  return (
    <div style={vars} className={`shop shop-${spec.layout} min-h-screen`}>
      {/* Fonts are per shop, chosen by Gemini at runtime. */}
      <link rel="stylesheet" href={fontsHref(spec)} />
      <Hero view={view} buy={buy} />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 pb-24">
        <section className="grid gap-10 md:grid-cols-[1.4fr_1fr] py-14">
          <div className="space-y-5 text-lg leading-relaxed">
            {spec.story.split(/\n\s*\n/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <ul className="space-y-3 self-start">
            {spec.bullets.map((b, i) => (
              <li key={i} className="shop-card flex gap-3 p-4">
                <span aria-hidden className="mt-2 size-2 shrink-0 rounded-full" style={{ background: "var(--accent)" }} />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </section>

        {spec.details.length > 0 && (
          <section className="py-6">
            <h2 className="shop-h2">{spec.productType === "digital" ? "What's inside" : "The details"}</h2>
            <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {spec.details.map((d, i) => (
                <div key={i} className="border-b pb-3" style={{ borderColor: "color-mix(in srgb, var(--text) 15%, transparent)" }}>
                  <dt className="text-sm uppercase tracking-wider" style={{ color: "var(--muted)" }}>{d.label}</dt>
                  <dd className="mt-1">{d.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section className="py-10">
          <h2 className="shop-h2">Questions</h2>
          <div className="space-y-3">
            {spec.faq.map((f, i) => (
              <details key={i} className="shop-card p-5 group">
                <summary className="cursor-pointer font-semibold list-none flex justify-between gap-4">
                  {f.q}
                  <span aria-hidden className="transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                </summary>
                <p className="mt-3" style={{ color: "var(--muted)" }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="shop-card mt-6 p-6 sm:p-10 text-center space-y-4">
          <h2 className="shop-heading text-3xl">{spec.headline}</h2>
          <BuyBox view={view} buy={buy} centered />
        </section>
      </main>
      <footer className="pb-10 text-center text-sm" style={{ color: "var(--muted)" }}>
        Made with micro-shop · Payments by PayPal
      </footer>
    </div>
  );
}

function Hero({ view, buy }: { view: ShopView; buy: ReactNode }) {
  const { spec } = view;
  const art = view.heroUrl ?? view.photoUrl;
  const product = view.photoUrl ?? view.heroUrl;
  const copy = (
    <div className="space-y-5">
      <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>{spec.eyebrow}</p>
      <h1 className="shop-heading shop-h1">{spec.headline}</h1>
      <p className="text-xl" style={{ color: "var(--muted)" }}>{spec.subheadline}</p>
      <BuyBox view={view} buy={buy} />
    </div>
  );

  switch (spec.layout) {
    case "bold-hero":
      return (
        <header className="relative">
          {art && (
            // eslint-disable-next-line @next/next/no-img-element -- user uploads, served from our DB
            <img src={art} alt={spec.imageAlt} className="h-[46vh] min-h-72 w-full object-cover" />
          )}
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className={`shop-card relative p-6 sm:p-10 ${art ? "-mt-28" : "mt-10"}`}>{copy}</div>
          </div>
        </header>
      );
    case "editorial":
      return (
        <header className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 py-10 md:grid-cols-2 md:py-16">
          {product && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product} alt={spec.imageAlt} className="aspect-[4/5] w-full object-cover" />
          )}
          {copy}
        </header>
      );
    case "minimal":
      return (
        <header className="mx-auto max-w-3xl px-4 sm:px-6 pt-16 pb-6 text-center">
          {product && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product} alt={spec.imageAlt} className="mx-auto mb-12 max-h-[52vh] w-auto object-contain" />
          )}
          <div className="[&_.buybox]:items-center">{copy}</div>
        </header>
      );
    case "playful":
      return (
        <header className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 py-10 md:grid-cols-[1fr_1.1fr] md:py-16">
          {copy}
          {product && (
            <div className="relative">
              <div aria-hidden className="absolute -inset-4 rotate-3 rounded-[2.5rem]" style={{ background: "var(--accent)" }} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product} alt={spec.imageAlt} className="relative -rotate-2 aspect-square w-full rounded-[2rem] object-cover shadow-xl" />
            </div>
          )}
        </header>
      );
  }
}

function BuyBox({ view, buy, centered }: { view: ShopView; buy: ReactNode; centered?: boolean }) {
  const soldOut = view.stock !== null && view.stock <= 0;
  return (
    <div className={`buybox flex flex-col gap-3 pt-2 ${centered ? "items-center" : ""}`}>
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="shop-heading text-4xl">{view.priceLabel}</span>
        <span style={{ color: "var(--muted)" }}>
          {view.shippingLabel === null
            ? "Instant download"
            : view.shippingLabel === "free"
              ? "Free shipping"
              : `+ ${view.shippingLabel} shipping`}
        </span>
      </div>
      {soldOut ? (
        <p className="font-semibold">Sold out</p>
      ) : (
        <div className="w-full max-w-sm">{buy}</div>
      )}
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        {view.stock !== null && view.stock > 0 && view.stock <= 10 && `Only ${view.stock} left · `}
        {view.shipCountries && `Ships to ${view.shipCountries.split(",").join(", ")} · `}
        Secure checkout with PayPal
      </p>
    </div>
  );
}
