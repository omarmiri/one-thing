import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { fontsHref, isLight, type DesignSpec } from "@/lib/design";
import { TestModeSwitch } from "@/components/TestModeSwitch";
import type { Referral } from "@/lib/channel3";
import type { ShowcaseView } from "@/lib/showcase";
import { FeatureStory } from "@/components/motion/FeatureStory";
import { StickyBuy } from "@/components/motion/StickyBuy";
import type { Feel } from "@/components/motion/springs";
import { Arcade } from "./Arcade";
import { Gallery, type ColorPhotos } from "./Gallery";
import { OptionPicker } from "./OptionPicker";
import { PayOnPhone } from "./PayOnPhone";
import { allSoldOut, type OptionStock, type ShopOption } from "@/lib/options";

// Renders a design spec. Server component; the only client JS is the buy button passed in,
// the showcase when the shop has one, and the motion pieces when `motion` is set.
// Elements marked data-surface are what the motion layer (components/motion/engine.ts) moves.

export type ShopView = {
  spec: DesignSpec;
  priceLabel: string;
  shippingLabel: string | null; // null for digital
  digitalLabel: string;
  shipCountries: string | null;
  stock: number | null;
  slug?: string;
  options?: ShopOption[]; // sizes, colours…: the buyer picks before paying
  optionStock?: OptionStock;
  colorPhotos?: ColorPhotos | null;
  photoUrl: string | null;
  photos?: string[]; // all product photos, cover first; more than one makes a gallery
  heroUrl: string | null;
  referral: Referral | null; // a recommendation: buyers purchase at the retailer
  shareUrl?: string | null; // absolute link, for the pay-on-your-phone QR code
  agentUrl?: string | null; // absolute product JSON link, written out for assistants that only open URLs they've seen
  showcase?: ShowcaseView | null; // a playable teaser built from the seller's game art
};

export function ShopPage({ view, buy, motion }: { view: ShopView; buy: ReactNode; motion?: { feel: Feel } }) {
  const { spec } = view;
  const product = view.photoUrl ?? view.heroUrl;
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
        {view.showcase && <Arcade showcase={view.showcase} />}

        {motion ? (
          <FeatureStory
            story={spec.story}
            bullets={spec.bullets}
            image={product}
            photos={view.photos}
            imageAlt={spec.imageAlt}
            feel={motion.feel}
            melt={Boolean(view.photoUrl) && isLight(spec.palette.surface)}
          />
        ) : (
        <section className="grid gap-10 md:grid-cols-[1.4fr_1fr] py-14">
          <div className="space-y-5 text-lg leading-relaxed">
            {spec.story.split(/\n\s*\n/).map((para, i) => (
              <p key={i} data-surface="text">{para}</p>
            ))}
          </div>
          <ul className="space-y-3 self-start">
            {spec.bullets.map((b, i) => (
              <li key={i} data-surface="card" data-group="bullets" className="shop-card flex gap-3 p-4">
                <span aria-hidden className="mt-2 size-2 shrink-0 rounded-full" style={{ background: "var(--accent)" }} />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </section>
        )}

        {spec.details.length > 0 && (
          <section className="py-6">
            <h2 data-surface="text" className="shop-h2">{spec.productType === "digital" ? "What's inside" : "The details"}</h2>
            <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {spec.details.map((d, i) => (
                <div key={i} data-surface="card" data-group="details" className="border-b pb-3" style={{ borderColor: "color-mix(in srgb, var(--text) 15%, transparent)" }}>
                  <dt className="text-sm uppercase tracking-wider" style={{ color: "var(--muted)" }}>{d.label}</dt>
                  <dd className="mt-1">{d.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section className="py-10">
          <h2 data-surface="text" className="shop-h2">Questions</h2>
          <div className="space-y-3">
            {spec.faq.map((f, i) => (
              <details key={i} data-surface="card" data-group="faq" className="shop-card p-5 group">
                <summary className="cursor-pointer font-semibold list-none flex justify-between gap-4">
                  {f.q}
                  <span aria-hidden className="transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                </summary>
                <p className="mt-3" style={{ color: "var(--muted)" }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="buy" data-surface="panel" className="shop-card mt-6 p-6 sm:p-10 text-center space-y-4 scroll-mt-6">
          <h2 className="shop-heading text-3xl">{spec.headline}</h2>
          <BuyBox view={view} buy={buy} centered />
        </section>
      </main>
      {motion && !view.referral && (
        <StickyBuy name={spec.productName} price={view.priceLabel} image={product} cta={spec.ctaLabel} buy={buy} feel={motion.feel} />
      )}
      <footer className="pb-10 text-center text-sm" style={{ color: "var(--muted)" }}>
        Made with{" "}
        <Link href="/" target="_top" className="underline underline-offset-2 hover:opacity-80">
          OneThing
        </Link>{" "}
        · Payments by PayPal · <TestModeSwitch byHand />
        {view.agentUrl && (
          // Written out in full: some assistants' fetch tools only open URLs that appeared on a page.
          <p className="mx-auto mt-2 max-w-xl break-all px-4 text-xs">
            AI assistant? This product with its order links: <a href={view.agentUrl}>{view.agentUrl}</a>
          </p>
        )}
      </footer>
    </div>
  );
}

function Hero({ view, buy }: { view: ShopView; buy: ReactNode }) {
  const { spec } = view;
  const art = view.heroUrl ?? view.photoUrl;
  const product = view.photoUrl ?? view.heroUrl;
  // Several photos make a swipeable gallery in the product's place.
  const photos = view.photos ?? [];
  const gallery = (frameClass: string, imgClass: string) =>
    photos.length > 1 ? (
      <div data-surface="image">
        <Gallery photos={photos} slug={view.slug} colorPhotos={view.colorPhotos} alt={spec.imageAlt} frameClass={frameClass} imgClass={imgClass} />
      </div>
    ) : null;
  const copy = (
    <div className="space-y-5">
      <p data-surface="text" className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>{spec.eyebrow}</p>
      <h1 data-surface="text" className="shop-heading shop-h1">{spec.headline}</h1>
      <p data-surface="text" className="text-xl" style={{ color: "var(--muted)" }}>{spec.subheadline}</p>
      <div data-surface="panel" data-buy="hero">
        <BuyBox view={view} buy={buy} />
      </div>
    </div>
  );

  switch (spec.layout) {
    case "bold-hero":
      return (
        <header className="relative">
          {art && (
            // eslint-disable-next-line @next/next/no-img-element -- user uploads, served from our DB
            <img data-surface="image" data-inspect src={art} alt={spec.imageAlt} className="h-[46vh] min-h-72 w-full object-cover" />
          )}
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className={`shop-card relative p-6 sm:p-10 ${art ? "-mt-28" : "mt-10"}`}>{copy}</div>
            {/* The banner is art; the product's own photos get a gallery under it. */}
            {gallery("mt-10 aspect-[4/3] w-full rounded-2xl md:aspect-[16/9]", "object-cover")}
          </div>
        </header>
      );
    case "editorial":
      return (
        <header className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 py-10 md:grid-cols-2 md:py-16">
          {gallery("aspect-[4/5] w-full", "object-cover") ??
            (product && (
              // eslint-disable-next-line @next/next/no-img-element
              <img data-surface="image" data-inspect src={product} alt={spec.imageAlt} className="aspect-[4/5] w-full object-cover" />
            ))}
          {copy}
        </header>
      );
    case "minimal":
      return (
        <header className="mx-auto max-w-3xl px-4 sm:px-6 pt-16 pb-6 text-center">
          {gallery("mx-auto mb-12 h-[52vh] w-full", "object-contain") ??
            (product && (
              // eslint-disable-next-line @next/next/no-img-element
              <img data-surface="image" data-inspect src={product} alt={spec.imageAlt} className="mx-auto mb-12 max-h-[52vh] w-auto object-contain" />
            ))}
          <div className="[&_.buybox]:items-center">{copy}</div>
        </header>
      );
    case "playful":
      return (
        <header className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 py-10 md:grid-cols-[1fr_1.1fr] md:py-16">
          {copy}
          {product && (
            <div data-surface="image" className="relative">
              <div aria-hidden className="absolute -inset-4 rotate-3 rounded-[2.5rem]" style={{ background: "var(--accent)" }} />
              {photos.length > 1 ? (
                <Gallery photos={photos} slug={view.slug} colorPhotos={view.colorPhotos} alt={spec.imageAlt} frameClass="relative -rotate-2 aspect-square w-full rounded-[2rem] shadow-xl" imgClass="object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img data-inspect src={product} alt={spec.imageAlt} className="relative -rotate-2 aspect-square w-full rounded-[2rem] object-cover shadow-xl" />
              )}
            </div>
          )}
        </header>
      );
  }
}

const fmt = (n: number, c: string) => new Intl.NumberFormat("en-US", { style: "currency", currency: c }).format(n);

/** Recommendations: one button per retailer, through Channel3's tracked links. */
function RetailerBox({ referral, centered }: { referral: Referral; centered?: boolean }) {
  const [best, ...rest] = referral.offers;
  return (
    <div className={`buybox flex flex-col gap-3 pt-2 ${centered ? "items-center" : ""}`}>
      <span className="shop-heading text-4xl">{fmt(best.price, best.currency)}</span>
      <a href={best.url} target="_blank" rel="sponsored noopener" className="shop-buy block max-w-sm text-center">
        Buy at {best.domain}
      </a>
      {rest.length > 0 && (
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Also at{" "}
          {rest.map((o, i) => (
            <span key={o.domain}>
              {i > 0 && ", "}
              <a href={o.url} target="_blank" rel="sponsored noopener" className="underline">
                {o.domain} {fmt(o.price, o.currency)}
              </a>
            </span>
          ))}
        </p>
      )}
      <p className="text-xs" style={{ color: "var(--muted)" }}>
        A recommendation. If you buy through these links, this shop may earn a commission at no cost to you.
      </p>
    </div>
  );
}

function BuyBox({ view, buy, centered }: { view: ShopView; buy: ReactNode; centered?: boolean }) {
  if (view.referral?.offers.length) return <RetailerBox referral={view.referral} centered={centered} />;
  const options = view.options ?? [];
  const soldOut = options.length ? allSoldOut(options, view.optionStock ?? {}) : view.stock !== null && view.stock <= 0;
  return (
    <div className={`buybox flex flex-col gap-3 pt-2 ${centered ? "items-center" : ""}`}>
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="shop-heading text-4xl">{view.priceLabel}</span>
        <span style={{ color: "var(--muted)" }}>
          {view.shippingLabel === null
            ? view.digitalLabel
            : view.shippingLabel === "free"
              ? "Free shipping"
              : `+ ${view.shippingLabel} shipping`}
        </span>
      </div>
      {soldOut ? (
        <p className="font-semibold">Sold out</p>
      ) : (
        <>
          {options.length > 0 && view.slug && <OptionPicker slug={view.slug} options={options} stock={view.optionStock ?? {}} />}
          <div className="w-full max-w-sm">{buy}</div>
        </>
      )}
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        {view.stock !== null && view.stock > 0 && view.stock <= 10 && `Only ${view.stock} left · `}
        {view.shipCountries && `Ships to ${view.shipCountries.split(",").join(", ")} · `}
        Secure checkout with PayPal
      </p>
      {!centered && !soldOut && view.shareUrl && <PayOnPhone url={view.shareUrl} />}
    </div>
  );
}
