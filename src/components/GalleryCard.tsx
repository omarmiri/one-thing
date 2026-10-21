import Link from "next/link";
import { money, shopView, type Shop } from "@/lib/shops";

const KIND = { physical: "Physical", digital: "Digital", referral: "Recommended" } as const;

/** One live shop in the gallery, drawn in that shop's own AI-chosen palette. */
export function GalleryCard({ shop }: { shop: Shop }) {
  const view = shopView(shop);
  const { palette: p } = shop.spec;
  const image = view.photoUrl ?? view.heroUrl ?? shop.referral?.image ?? null;
  const soldOut = shop.product_type === "physical" && shop.stock === 0;

  return (
    <Link
      href={`/${shop.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 transition hover:-translate-y-1 hover:shadow-lg"
      style={{ background: p.background, color: p.text }}
    >
      <div className="aspect-square overflow-hidden" style={{ background: p.surface }}>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={shop.spec.imageAlt} className="size-full object-cover transition duration-500 group-hover:scale-105" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: p.accent }}>
          {KIND[shop.product_type]}
        </p>
        <h3 className="mt-2 text-lg font-semibold leading-snug">{shop.spec.productName}</h3>
        <p className="mt-1 line-clamp-2 text-sm" style={{ color: p.muted }}>
          {shop.spec.headline}
        </p>
        <p className="mt-auto pt-4 font-semibold">
          {soldOut ? "Sold out" : money(shop.price_cents, shop.currency)}
        </p>
      </div>
    </Link>
  );
}
