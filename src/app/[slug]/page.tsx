import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { BuyButton } from "@/components/shop/BuyButton";
import { ShopPage } from "@/components/shop/ShopPage";
import { tokensMatch } from "@/lib/ids";
import { sdkUrl } from "@/lib/paypal";
import { getShopBySlug, shopView } from "@/lib/shops";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: PageProps<"/[slug]">): Promise<Metadata> {
  const shop = await getShopBySlug((await props.params).slug);
  if (!shop) return {};
  return {
    title: shop.spec.productName,
    description: shop.spec.subheadline,
    openGraph: { images: shop.hero_blob || shop.photo_blob ? [`/api/blobs/${shop.hero_blob ?? shop.photo_blob}`] : [] },
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

  return (
    <>
      {shop.status !== "live" && (
        <div className="sticky top-0 z-10 bg-amber-300 px-4 py-2 text-center text-sm font-medium text-black">
          Draft preview — only you can see this. Publish it from your manage page.
        </div>
      )}
      <ShopPage
        view={shopView(shop)}
        buy={
          shop.status === "live" ? (
            <BuyButton slug={shop.slug} clientId={process.env.PAYPAL_CLIENT_ID ?? null} sdkUrl={sdkUrl()} label={shop.spec.ctaLabel} />
          ) : (
            <button className="shop-buy" disabled>{shop.spec.ctaLabel}</button>
          )
        }
      />
    </>
  );
}
