import "server-only";
import { appUrl } from "./ids";
import type { Order, Shop } from "./shops";

/**
 * Sponsor tool: Zapier. A seller pastes a Zapier "Catch Hook" URL in settings, and every paid
 * order is posted to it — from there, Zapier can put it in a Google Sheet, Slack, a label printer…
 * Best-effort: a broken hook never affects the sale.
 */
export async function notifyZapier(shop: Shop, event: "order.paid" | "order.shipped", order: Order) {
  if (!shop.zapier_hook_url?.startsWith("https://hooks.zapier.com/")) return;
  try {
    await fetch(shop.zapier_hook_url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        event,
        shop: { slug: shop.slug, name: shop.spec.productName, url: `${appUrl()}/s/${shop.slug}` },
        order: {
          id: order.id,
          paypal_order_id: order.paypal_order_id,
          amount: (order.amount_cents / 100).toFixed(2),
          currency: order.currency,
          buyer_name: order.buyer_name,
          buyer_email: order.buyer_email,
          shipping_address: order.shipping_address,
          fulfillment_status: order.fulfillment_status,
          tracking_number: order.tracking_number,
          carrier: order.carrier,
        },
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    console.warn("Zapier hook failed:", (err as Error).message);
  }
}
