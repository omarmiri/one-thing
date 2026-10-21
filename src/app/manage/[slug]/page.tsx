import { notFound } from "next/navigation";
import { blobUrl, getOwnedShop, listOrders, listWebhookEvents, shopPhotos } from "@/lib/shops";
import { geminiEnabled } from "@/lib/gemini";
import { paypalEnabled } from "@/lib/paypal";
import { appUrl } from "@/lib/ids";
import { ManageApp } from "./ManageApp";

export const dynamic = "force-dynamic";
export const metadata = { title: "Manage your shop · OneThing", robots: { index: false } };

export default async function Manage(props: PageProps<"/manage/[slug]">) {
  const { slug } = await props.params;
  const { token } = await props.searchParams;
  const shop = typeof token === "string" ? await getOwnedShop(slug, token) : null;
  if (!shop) notFound();
  const orders = (await listOrders(shop.id)).filter((o) => o.status !== "created");
  const webhooks = await listWebhookEvents(shop.id);

  return (
    <ManageApp
      token={shop.admin_token}
      initial={{
        status: shop.status,
        name: shop.spec.productName,
        heroStatus: shop.hero_status,
        aiSource: shop.ai_source,
        photos: shop.product_type === "referral" ? null : shopPhotos(shop).map((id) => ({ id, url: blobUrl(id)! })),
        setup: {
          slug: shop.slug,
          productType: shop.product_type,
          delivery: shop.delivery,
          accessUrl: shop.access_url,
          hasDigitalFile: Boolean(shop.digital_blob),
          price: shop.price_cents / 100,
          shipping: shop.shipping_cents / 100,
          stock: shop.stock,
          shipCountries: shop.ship_countries,
          paypalEmail: shop.paypal_email,
          sellerEmail: shop.seller_email,
          zapierHookUrl: shop.zapier_hook_url,
          inGallery: shop.in_gallery,
          referral: shop.referral && {
            offers: shop.referral.offers.map(({ domain, price, currency, commission }) => ({ domain, price, currency, commission })),
          },
        },
      }}
      orders={orders.map(({ download_token: _d, ...o }) => o)}
      webhooks={webhooks}
      geminiReady={geminiEnabled()}
      paypalReady={paypalEnabled()}
      linkPrefix={new URL(appUrl()).host}
    />
  );
}
