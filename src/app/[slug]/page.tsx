import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { ShopBuy } from "@/components/shop/ShopBuy";
import { ShopPage } from "@/components/shop/ShopPage";
import { appUrl, tokensMatch } from "@/lib/ids";
import { blobUrl, getShopBySlug, shopPhotos, shopView, type Shop as ShopRow } from "@/lib/shops";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: PageProps<"/[slug]">): Promise<Metadata> {
  const shop = await getShopBySlug((await props.params).slug);
  if (!shop) return {};
  return {
    title: shop.spec.productName,
    description: shop.spec.subheadline,
    openGraph: { images: shop.hero_blob || shop.photo_blob ? [`/api/blobs/${shop.hero_blob ?? shop.photo_blob}`] : [] },
    // Agent-ready: machines find the product JSON (and from it, the MCP server) from the page.
    alternates: { types: { "application/json": `/api/agent/shops/${shop.slug}`, "text/plain": "/llms.txt" } },
  };
}

export default async function Shop(props: PageProps<"/[slug]">) {
  const { slug } = await props.params;
  const { token } = await props.searchParams;
  const shop = await getShopBySlug(slug);
  // A former name: send people (and search engines) to the current link.
  if (shop && shop.slug !== slug) permanentRedirect(`/${shop.slug}${typeof token === "string" ? `?token=${token}` : ""}`);
  // Drafts are visible only to their seller (manage page preview link carries the token).
  const isOwner = shop && typeof token === "string" && tokensMatch(token, shop.admin_token);
  if (!shop || (shop.status !== "live" && !isOwner)) notFound();
  // Motion is on unless the link asks for the plain page (?motion=0).
  const motion = (await props.searchParams).motion !== "0" ? { feel: "calm" as const } : undefined;

  return (
    <>
      {shop.status !== "live" && (
        <div className="sticky top-0 z-10 bg-amber-300 px-4 py-2 text-center text-sm font-medium text-black">
          Draft preview: only you can see this. Go live from your manage page.
        </div>
      )}
      {shop.status === "live" && (
        <script
          type="application/ld+json"
          // JSON in a script tag: escape "<" so a product name can't close the tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(shop)).replace(/</g, "\\u003c") }}
        />
      )}
      <MotionRoot feel="calm" enabled={Boolean(motion)}>
        <ShopPage view={{ ...shopView(shop), shareUrl: `${appUrl()}/${shop.slug}` }} buy={<ShopBuy shop={shop} />} motion={motion} />
      </MotionRoot>
    </>
  );
}

/** schema.org Product, the vocabulary shopping agents and search engines already read. */
function productJsonLd(shop: ShopRow) {
  const url = `${appUrl()}/${shop.slug}`;
  const referral = shop.product_type === "referral" ? shop.referral : null;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: shop.spec.productName,
    description: shop.spec.subheadline,
    url,
    image: referral?.image ? [referral.image] : shopPhotos(shop).map((id) => `${appUrl()}${blobUrl(id)}`),
    offers: referral
      ? referral.offers.map((o) => ({ "@type": "Offer", price: o.price, priceCurrency: o.currency, url: o.url, seller: o.domain }))
      : {
          "@type": "Offer",
          price: (shop.price_cents / 100).toFixed(2),
          priceCurrency: shop.currency,
          url,
          availability: `https://schema.org/${shop.stock !== null && shop.stock <= 0 ? "SoldOut" : "InStock"}`,
        },
  };
}
