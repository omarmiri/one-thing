import "server-only";
import { one } from "./db";
import { appUrl } from "./ids";
import { allSoldOut, comboKey, combos, stockOf } from "./options";
import { captureWithStock, CheckoutError, startCheckout } from "./orders";
import { PayPalError, paypalEnabled } from "./paypal";
import { blobUrl, getOrder, getShopBySlug, listLiveShops, money, shopPhotos, withCode, type Shop } from "./shops";

// Agent-ready shops: what an AI shopping agent sees and can do, shared by the product JSON
// (/api/agent/shops/<slug>) and the MCP server (/api/mcp). Agents find and order; the buyer
// still approves every payment at PayPal, so no agent can spend someone's money on its own.

/** The order's pay link on this site. It redirects to PayPal, so it's safe to show in chat. */
const payUrl = (orderId: string) => `${appUrl()}/o/${orderId}`;

const abs = (path: string | null) => (path ? (path.startsWith("http") ? path : `${appUrl()}${path}`) : null);

/** Everything an agent needs to describe a product and decide to buy it. */
export function agentProduct(shop: Shop) {
  const s = shop.spec;
  const referral = shop.product_type === "referral" ? shop.referral : null;
  const shipping = shop.product_type === "physical" ? shop.shipping_cents : 0;
  const options = shop.product_type === "physical" ? (shop.options ?? []) : [];
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
          ...(options.length
            ? {
                // The buyer must pick one value per option; pass them to create_order as { name: value }.
                options: options.map((o) => ({ name: o.name, values: o.values.map((v) => v.label) })),
                variants: combos(options).map((c) => {
                  const n = stockOf(shop.option_stock ?? {}, comboKey(options, c));
                  return { choice: c, availability: n === null ? "in_stock" : n > 0 ? `in_stock (${n} left)` : "sold_out" };
                }),
                availability: allSoldOut(options, shop.option_stock ?? {}) ? "sold_out" : "in_stock",
              }
            : { availability: shop.stock === null ? "in_stock" : shop.stock > 0 ? `in_stock (${shop.stock} left)` : "sold_out" }),
          how_to_buy: options.length
            ? "Call create_order on the OneThing MCP server with shop and options, then give the buyer its pay_url to pay at PayPal."
            : "Call create_order on the OneThing MCP server, then give the buyer its pay_url to pay at PayPal.",
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
export async function agentCreateOrder(slug: string, choice?: Record<string, string>) {
  if (!paypalEnabled()) throw new AgentError("Checkout isn't available on this server.");
  const shop = await liveShop(slug);
  if (shop.product_type === "referral") throw new AgentError("This product is sold by a retailer: use one of the offer links from get_product.");
  try {
    const o = await startCheckout(shop, "agent", choice);
    if (!o.approveUrl) throw new AgentError("PayPal didn't return an approval link. Try again.");
    return {
      order_id: o.localId,
      status: "awaiting_buyer_approval",
      total: money(o.amountCents, shop.currency),
      ...(o.choice && { options: o.choice }),
      pay_url: payUrl(o.localId),
      next_step:
        "Show pay_url to the buyer as a link. It opens PayPal, where they pay (and enter a shipping address for physical items). " +
        "When they say they've paid, call get_order with order_id: it returns the access code, download link or shipping details.",
    };
  } catch (err) {
    if (err instanceof AgentError) throw err;
    if (err instanceof CheckoutError) throw new AgentError(err.message);
    console.error("agent create_order:", err);
    throw new AgentError(
      err instanceof PayPalError && err.body.includes("PAYEE_ACCOUNT")
        ? "This shop's PayPal account can't receive payments yet."
        : "Couldn't start checkout. Try again.",
    );
  }
}

type AgentStatus = "awaiting_buyer_approval" | "paid" | "declined" | "sold_out" | "expired" | "failed";

const NEXT_STEP: Record<Exclude<AgentStatus, "paid">, string> = {
  awaiting_buyer_approval: "The buyer hasn't paid yet. Give them pay_url; when they say they've paid, call get_order again.",
  declined: "PayPal declined the payment. Nothing was charged. The buyer can open pay_url again and pay another way.",
  sold_out: "It sold out before the payment went through. Nothing was charged. Offer something else.",
  expired: "This checkout expired at PayPal. Nothing was charged. Call create_order for a new one.",
  failed: "Couldn't reach PayPal to check this order. Call get_order again in a moment.",
};

/**
 * Where an order stands, and once it's paid, what the buyer got: the access code, download link
 * or shipping details, so an agent can finish without opening the thank-you page. Captures the
 * payment if the buyer approved but nothing has captured it yet.
 */
export async function agentGetOrder(orderId: string) {
  let order = await getOrder(orderId);
  if (!order) throw new AgentError("No order with that id.");
  const outcome = await captureWithStock(order);
  if (outcome === "paid") order = (await getOrder(order.id)) ?? order;
  const shop = await one<Shop>("SELECT * FROM shops WHERE id = $1", [order.shop_id]);
  if (!shop) throw new AgentError("No order with that id.");

  const status: AgentStatus = order.status === "paid" ? "paid" : outcome === "pending" || outcome === "paid" ? "awaiting_buyer_approval" : outcome;
  const addr = order.shipping_address;
  return {
    order_id: order.id,
    status,
    product: shop.spec.productName,
    ...(order.options && { options: order.options }),
    amount: {
      item: (order.amount_cents - order.shipping_cents) / 100,
      shipping: order.shipping_cents / 100,
      total: order.amount_cents / 100,
      currency: order.currency,
    },
    total: money(order.amount_cents, order.currency),
    ...(status === "paid"
      ? {
          paid_at: order.paid_at,
          receipt_url: `${appUrl()}/${shop.slug}/thanks?order=${order.id}`,
          delivery: order.access_code
            ? {
                type: "access_code",
                access_code: order.access_code,
                ...(shop.access_url && { start_url: withCode(shop.access_url, order.access_code) }),
              }
            : order.download_token
              ? { type: "download", download_url: `${appUrl()}/api/download/${order.download_token}`, note: "Works 5 times over 14 days." }
              : {
                  type: "shipping",
                  ship_to: addr
                    ? {
                        name: order.buyer_name,
                        address: [addr.address_line_1, addr.address_line_2, addr.admin_area_2, addr.admin_area_1, addr.postal_code, addr.country_code]
                          .filter(Boolean)
                          .join(", "),
                      }
                    : null,
                  fulfillment: order.fulfillment_status,
                  tracking: order.tracking_number ? { carrier: order.carrier, number: order.tracking_number } : null,
                },
        }
      : {
          ...((status === "awaiting_buyer_approval" || status === "declined") && { pay_url: payUrl(order.id) }),
          next_step: NEXT_STEP[status],
        }),
  };
}
