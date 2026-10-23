import { notFound } from "next/navigation";
import { currentAccount } from "@/lib/accounts";
import { blobUrl, getOwnedShop, getShopBySlug, listOrders, listWebhookEvents, shopPhotos, updateShop } from "@/lib/shops";
import { designerReady, geminiEnabled } from "@/lib/gemini";
import { paypalConnectEnabled, paypalEnabled } from "@/lib/paypal";
import { appUrl } from "@/lib/ids";
import { ManageApp } from "./ManageApp";

export const dynamic = "force-dynamic";
export const metadata = { title: "Manage your shop · OneThing", robots: { index: false } };

export default async function Manage(props: PageProps<"/manage/[slug]">) {
  const { slug } = await props.params;
  const { token, paypal } = await props.searchParams;
  const account = await currentAccount();
  // The private link (?token=) always works. Signed in, your own shops open without it.
  let shop = typeof token === "string" ? await getOwnedShop(slug, token) : null;
  if (!shop && account) {
    const mine = await getShopBySlug(slug);
    if (mine?.account_id === account.id) shop = mine;
  }
  if (!shop) notFound();
  // Opening a shop's private link while signed in adds a shop made before accounts to yours.
  if (account && !shop.account_id) {
    await updateShop(shop.id, { account_id: account.id });
    shop.account_id = account.id;
  }
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
          paypal: paypalConnectEnabled()
            ? { merchantId: shop.paypal_merchant_id, status: shop.paypal_status, returned: typeof paypal === "string" ? paypal : null }
            : null,
          sellerEmail: shop.seller_email,
          zapierHookUrl: shop.zapier_hook_url,
          inGallery: shop.in_gallery,
          galleryStatus: shop.gallery_status,
          options: shop.options ?? [],
          optionStock: shop.option_stock ?? {},
          suggestions: shop.suggestions,
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
      // The design A/B test: for signed-in sellers, on shops in their account.
      ab={
        account && shop.account_id === account.id
          ? {
              model: shop.ai_model,
              b: shop.design_b && { model: shop.design_b.model, seconds: shop.design_b.seconds },
              ready: { gemini: designerReady("gemini"), qwen: designerReady("qwen") },
            }
          : null
      }
    />
  );
}
