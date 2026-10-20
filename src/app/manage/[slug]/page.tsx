import { notFound } from "next/navigation";
import { getOwnedShop, listOrders, listWebhookEvents } from "@/lib/shops";
import { geminiEnabled } from "@/lib/gemini";
import { paypalEnabled } from "@/lib/paypal";
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
        slug: shop.slug,
        status: shop.status,
        productType: shop.product_type,
        name: shop.spec.productName,
        heroStatus: shop.hero_status,
        hasDigitalFile: Boolean(shop.digital_blob),
        delivery: shop.delivery,
        accessUrl: shop.access_url,
        aiSource: shop.ai_source,
        settings: {
          price: shop.price_cents / 100,
          shipping: shop.shipping_cents / 100,
          stock: shop.stock,
          ship_countries: shop.ship_countries,
          paypal_email: shop.paypal_email,
          seller_email: shop.seller_email,
          zapier_hook_url: shop.zapier_hook_url,
        },
      }}
      orders={orders.map(({ download_token: _d, ...o }) => o)}
      webhooks={webhooks}
      geminiReady={geminiEnabled()}
      paypalReady={paypalEnabled()}
    />
  );
}
