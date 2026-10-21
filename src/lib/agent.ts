import "server-only";
import { one } from "./db";
import { appUrl } from "./ids";
import { captureIfApproved, startCheckout } from "./orders";
import { PayPalError, paypalEnabled } from "./paypal";
import { blobUrl, getOrder, getShopBySlug, listLiveShops, money, shopPhotos, type Shop } from "./shops";

// Agent-ready shops: what an AI shopping agent sees and can do, shared by the product JSON
// (/api/agent/shops/<slug>) and the MCP server (/api/mcp). Agents find and order; the buyer
// still approves every payment at PayPal, so no agent can spend someone's money on its own.

const abs = (path: string | null) => (path ? (path.startsWith("http") ? path : `${appUrl()}${path}`) : null);

/** Everything an agent needs to describe a product and decide to buy it. */
export function agentProduct(shop: Shop) {
  const s = shop.spec;
  const referral = shop.product_type === "referral" ? shop.referral : null;
  const shipping = shop.product_type === "physical" ? shop.shipping_cents : 0;
  return {
    shop: shop.slug,
    url: `${appUrl()}/${shop.slug}`,
    name: s.productName,
    kind: shop.product_type, // physical | digital | referral
    headline: s.headline,
    description: [s.subheadline, s.story].filter(Boolean).join(" "),
    highlights: s.bullets,
    details: s.details,
    faq: s.faq,
    images: referral ? [referral.image].filter(Boolean) : shopPhotos(shop).map((id) => abs(blobUrl(id))),
    ...(referral
      ? {
          // Someone else's product: bought at the retailer, not through PayPal here.
          how_to_buy: "At the retailer, through one of the links below.",
          offers: referral.offers.map((o) => ({ retailer: o.domain, price: o.price, currency: o.currency, in_stock: o.inStock, url: o.url })),
        }
      : {
          price: { amount: shop.price_cents / 100, currency: shop.currency, label: money(shop.price_cents, shop.currency) },
          shipping:
            shop.product_type === "physical"
              ? { amount: shipping / 100, currency: shop.currency, ships_to: shop.ship_countries?.split(",").map((c) => c.trim()) ?? [] }
              : null,
          total: { amount: (shop.price_cents + shipping) / 100, currency: shop.currency },
          delivery:
            shop.product_type === "physical"
              ? "Shipped. PayPal collects the buyer's address at checkout."
              : shop.delivery === "access_code"
                ? "An access code, shown right after payment."
                : "A download link, shown right after payment.",
          availability: shop.stock === null ? "in_stock" : shop.stock > 0 ? `in_stock (${shop.stock} left)` : "sold_out",
          how_to_buy: "Call create_order on the OneThing MCP server, then have the buyer approve at PayPal.",
        }),
  };
}

/** Live shops in the public gallery matching a query (every word must appear), newest first. */
export async function searchShops(q: string | undefined, limit = 10) {
  const words = (q ?? "").toLowerCase().split(/\s+/).filter(Boolean);
  const shops = await listLiveShops(200);
  return shops
    .filter((shop) => {
      const text = [shop.spec.productName, shop.spec.headline, shop.spec.subheadline, shop.spec.eyebrow, shop.description].join(" ").toLowerCase();
      return words.every((w) => text.includes(w));
    })
    .slice(0, limit)
    .map((shop) => {
      const p = agentProduct(shop);
      return { shop: p.shop, name: p.name, kind: p.kind, headline: p.headline, price: "price" in p ? p.price?.label : null, url: p.url };
    });
}

export class AgentError extends Error {}

export async function liveShop(slug: string) {
  const shop = await getShopBySlug(slug);
  if (!shop || shop.status !== "live") throw new AgentError(`No live shop called "${slug}". Try search_shops.`);
  return shop;
}

/** One unit on order, waiting for the buyer to approve at PayPal. */
export async function agentCreateOrder(slug: string) {
  if (!paypalEnabled()) throw new AgentError("Checkout isn't available on this server.");
  const shop = await liveShop(slug);
  if (shop.product_type === "referral") throw new AgentError("This product is sold by a retailer: use one of the offer links from get_product.");
  if (shop.stock !== null && shop.stock <= 0) throw new AgentError("Sold out.");
  try {
    const o = await startCheckout(shop, "agent");
    if (!o.approveUrl) throw new AgentError("PayPal didn't return an approval link. Try again.");
    return {
      order_id: o.localId,
      total: money(o.amountCents, shop.currency),
      approve_url: o.approveUrl,
      next_step:
        "Give approve_url to the buyer. They pay at PayPal (and enter a shipping address for physical items). " +
        "Then call get_order with order_id until status is paid.",
    };
  } catch (err) {
    if (err instanceof AgentError) throw err;
    console.error("agent create_order:", err);
    throw new AgentError(
      err instanceof PayPalError && err.body.includes("PAYEE_ACCOUNT")
        ? "This shop's PayPal account can't receive payments yet."
        : "Couldn't start checkout. Try again.",
    );
  }
}

/** Where an order stands. Captures it if the buyer approved but nothing has captured it yet. */
export async function agentGetOrder(orderId: string) {
  let order = await getOrder(orderId);
  if (!order) throw new AgentError("No order with that id.");
  order = await captureIfApproved(order);
  const shop = await one<{ slug: string }>("SELECT slug FROM shops WHERE id = $1", [order.shop_id]);
  const paid = order.status === "paid";
  return {
    order_id: order.id,
    status: paid ? "paid" : "awaiting_buyer_approval",
    total: money(order.amount_cents, order.currency),
    ...(paid && {
      paid_at: order.paid_at,
      // The buyer's receipt page: download link or access code for digital items.
      receipt_url: shop ? `${appUrl()}/${shop.slug}/thanks?order=${order.id}` : null,
      fulfillment: order.fulfillment_status,
      ...(order.tracking_number && { tracking: { carrier: order.carrier, number: order.tracking_number } }),
    }),
  };
}
