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

/** `?agent=<name>` to carry a name an agent gave itself into the links we hand back, so it sticks. */
const withAgent = (url: string, agent?: string | null) => (agent ? `${url}${url.includes("?") ? "&" : "?"}${new URLSearchParams({ agent })}` : url);

/**
 * A GET that creates an order: create_order for assistants that can only fetch URLs. Spelled out
 * in full in the product JSON and llms.txt, because some assistants only open URLs they've seen.
 */
export function orderLink(slug: string, choice?: Record<string, string>, agent?: string | null) {
  const q = choice ? `?${new URLSearchParams(choice)}` : "";
  return withAgent(`${appUrl()}/${slug}/buy${q}`, agent);
}

// show_buyer: a suggested reply to the buyer at each step, as Markdown with the links already
// written as links. Agents left to phrase it themselves were wordy and often printed bare URLs.
// It's a recommendation, not a rule: the agent still decides what to say.
// Worded as an instruction: put as a recommendation, Muse and Kimi left the photo out.
export const SHOW_BUYER =
  "Show show_buyer to the buyer exactly as written, photo included (it's Markdown, so the photo displays and the links stay clickable), " +
  "and keep your own words to a minimum.";
const link = (text: string, url: string) => `[${text.replace(/[[\]]/g, "")}](${url})`;
/** " (Ice Blue / L)", in the shop's option order: stored picks come back with their keys reordered. */
const picked = (shop: Shop, choice?: Record<string, string> | null) =>
  choice ? ` (${(shop.options ?? []).map((o) => choice[o.name]).filter(Boolean).join(" / ")})` : "";

const abs = (path: string | null) => (path ? (path.startsWith("http") ? path : `${appUrl()}${path}`) : null);

/** The cover photo's absolute URL: the retailer's image for a recommendation. */
const coverImage = (shop: Shop) => (shop.product_type === "referral" ? shop.referral?.image || null : abs(blobUrl(shopPhotos(shop)[0] ?? null)));
/**
 * The cover as a Markdown image, so chats that render images from replies show the product. Many
 * don't (they block images from other sites), and then it's just a line they leave out.
 */
const coverForBuyer = (shop: Shop) => {
  const url = coverImage(shop);
  // The blank line keeps it a paragraph of its own, not inline with the name.
  return url ? [`![${shop.spec.productName.replace(/[[\]]/g, "")}](${url})`, ""] : [];
};

/** The product in a few lines for the buyer: the photo, price, the options to pick from, and the question. */
function productForBuyer(shop: Shop, options: NonNullable<Shop["options"]>, soldOut: boolean) {
  const s = shop.spec;
  if (shop.product_type === "referral") {
    const offers = shop.referral?.offers ?? [];
    return [
      ...coverForBuyer(shop),
      `**${s.productName}**: ${s.headline}`,
      `Sold at ${offers.map((o) => link(`${o.domain} (${money(Math.round(o.price * 100), o.currency)})`, o.url)).join(" · ")}`,
    ].join("\n");
  }
  const shipping = shop.product_type === "physical" && shop.shipping_cents ? ` + ${money(shop.shipping_cents, shop.currency)} shipping` : "";
  return [
    ...coverForBuyer(shop),
    `**${s.productName}**: ${money(shop.price_cents, shop.currency)}${shipping}`,
    s.headline,
    ...options.map((o) => `${o.name}: ${o.values.map((v) => v.label).join(" · ")}`),
    soldOut ? "Sold out right now." : options.length ? `Which ${options.map((o) => o.name.toLowerCase()).join(" and ")}?` : "Want it?",
  ].join("\n");
}

/** Everything an agent needs to describe a product and decide to buy it. */
export function agentProduct(shop: Shop, agent?: string | null) {
  const s = shop.spec;
  const referral = shop.product_type === "referral" ? shop.referral : null;
  const shipping = shop.product_type === "physical" ? shop.shipping_cents : 0;
  const options = shop.product_type === "physical" ? (shop.options ?? []) : [];
  const soldOut = options.length ? allSoldOut(options, shop.option_stock ?? {}) : shop.stock === 0;
  return {
    show_buyer: productForBuyer(shop, options, soldOut),
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
                  return {
                    choice: c,
                    availability: n === null ? "in_stock" : n > 0 ? `in_stock (${n} left)` : "sold_out",
                    ...(n !== 0 && { order_url: orderLink(shop.slug, c, agent) }),
                  };
                }),
                availability: soldOut ? "sold_out" : "in_stock",
              }
            : {
                availability: shop.stock === null ? "in_stock" : shop.stock > 0 ? `in_stock (${shop.stock} left)` : "sold_out",
                ...(shop.stock !== 0 && { order_url: orderLink(shop.slug, undefined, agent) }),
              }),
          how_to_buy:
            `${SHOW_BUYER} Once the buyer has picked and said to buy, ` +
            (options.length
              ? "open the order_url of their variant (or call create_order on the OneThing MCP server with shop and options). "
              : "open order_url (or call create_order on the OneThing MCP server). ") +
            "Either returns show_buyer with the pay link.",
        }),
    ...(referral && { how_to_buy: `${SHOW_BUYER} The buyer buys at the retailer through one of the links.` }),
  };
}

// Words agents put in browsing queries ("find me something interesting to buy") that say nothing
// about the product. Left in, they matched no shop and the agent told the buyer the gallery was empty.
const FILLER = new Set(
  "a an the some any something anything thing things stuff item items product products me my i to for of on in at with and or find show buy get see browse shop shops store gallery onething sale sell selling available interesting cool nice good great fun unique random new popular best what's whats what is are there".split(" "),
);

/**
 * Live shops in the public gallery for a query, with show_buyer: each one's photo, name, price and
 * headline, and "Which one?". Shops matching more of the query's words come first, newest first
 * among equals. A query that matches nothing (or only says "something to buy") gets the newest
 * shops instead, with matched: false, rather than an empty list.
 */
export async function searchShops(q: string | undefined, limit = 10) {
  const words = (q ?? "").toLowerCase().split(/[^\p{L}\p{N}'-]+/u).filter((w) => w && !FILLER.has(w));
  const live = await listLiveShops(200);
  const scored = live
    .map((shop) => {
      const text = [shop.spec.productName, shop.spec.headline, shop.spec.subheadline, shop.spec.eyebrow, shop.description].join(" ").toLowerCase();
      return { shop, score: words.filter((w) => text.includes(w)).length };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);
  const matched = !words.length || scored.length > 0;
  const found = (words.length && scored.length ? scored.map((s) => s.shop) : live).slice(0, limit);
  const shops = found.map((shop) => {
    const p = agentProduct(shop);
    return { shop: p.shop, name: p.name, kind: p.kind, headline: p.headline, price: "price" in p ? p.price?.label : null, image: coverImage(shop), url: p.url };
  });
  const show_buyer = shops.length
    ? [
        ...(matched ? [] : [`Nothing matched "${q?.trim()}", so here's what's in the gallery:`, ""]),
        ...found.flatMap((shop, i) => [...coverForBuyer(shop), `**${shops[i].name}**${shops[i].price ? `: ${shops[i].price}` : ""}. ${shops[i].headline}`, ""]),
        shops.length > 1 ? "Which one?" : "Want it?",
      ].join("\n")
    : "Nothing in the OneThing gallery yet.";
  return { show_buyer, shops, matched };
}

export class AgentError extends Error {}

export async function liveShop(slug: string) {
  const shop = await getShopBySlug(slug);
  if (!shop || shop.status !== "live") throw new AgentError(`No live shop called "${slug}". Try search_shops.`);
  return shop;
}

/** What the buyer gets once paid, for "tell me once you've paid and I'll get you …". */
const deliveryNoun = (shop: Shop) =>
  shop.product_type === "physical" ? "the shipping confirmation" : shop.delivery === "access_code" ? "your access code" : "your download link";

/**
 * One unit on order, waiting for the buyer to approve at PayPal. agent is the name the agent gave
 * (carried on the links we return); credit is who the order is credited to (stats.ts agentName).
 */
export async function agentCreateOrder(slug: string, choice?: Record<string, string>, agent?: string | null, credit?: string) {
  if (!paypalEnabled()) throw new AgentError("Checkout isn't available on this server.");
  const shop = await liveShop(slug);
  if (shop.product_type === "referral") throw new AgentError("This product is sold by a retailer: use one of the offer links from get_product.");
  try {
    const o = await startCheckout(shop, "agent", choice, credit);
    if (!o.approveUrl) throw new AgentError("PayPal didn't return an approval link. Try again.");
    const total = money(o.amountCents, shop.currency);
    return {
      // The photo again, so the buyer still sees what they're paying for at the pay link.
      show_buyer: [
        ...coverForBuyer(shop),
        `${shop.spec.productName}${picked(shop, o.choice)}: ${total} total.`,
        `**${link(`Pay ${total} with PayPal`, payUrl(o.localId))}**`,
        `Tell me once you've paid and I'll get you ${deliveryNoun(shop)}.`,
      ].join("\n"),
      order_id: o.localId,
      status: "awaiting_buyer_approval",
      total,
      ...(o.choice && { options: o.choice }),
      pay_url: payUrl(o.localId),
      // The same answer as get_order, for clients that can only fetch URLs.
      status_url: withAgent(`${appUrl()}/o/${o.localId}/status`, agent),
      next_step:
        `${SHOW_BUYER} pay_url opens PayPal, where the buyer pays (and enters a shipping address for physical items). ` +
        "When they say they've paid, open status_url (or with MCP, call get_order with order_id): it returns the access code, download link or shipping details.",
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

type AgentStatus = "awaiting_buyer_approval" | "paid" | "declined" | "sold_out" | "expired" | "failed" | "refunded";

const NEXT_STEP: Record<Exclude<AgentStatus, "paid">, string> = {
  awaiting_buyer_approval: "The buyer hasn't paid yet. Give them pay_url; when they say they've paid, call get_order again.",
  declined: "PayPal declined the payment. Nothing was charged. The buyer can open pay_url again and pay another way.",
  sold_out: "It sold out before the payment went through. Nothing was charged. Offer something else.",
  expired: "This checkout expired at PayPal. Nothing was charged. Call create_order for a new one.",
  failed: "Couldn't reach PayPal to check this order. Call get_order again in a moment.",
  refunded: "The seller refunded this order in full; the money goes back to the buyer's PayPal. Its access code or download link no longer works.",
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

  const status: AgentStatus = order.status === "refunded" ? "refunded" : order.status === "paid" ? "paid" : outcome === "pending" || outcome === "paid" ? "awaiting_buyer_approval" : outcome;
  const addr = order.shipping_address;
  const total = money(order.amount_cents, order.currency);
  const receiptUrl = `${appUrl()}/${shop.slug}/thanks?order=${order.id}`;
  const shipTo = addr
    ? [addr.address_line_1, addr.address_line_2, addr.admin_area_2, addr.admin_area_1, addr.postal_code, addr.country_code].filter(Boolean).join(", ")
    : null;
  const pay = link(`Pay ${total} with PayPal`, payUrl(order.id));
  const forBuyer: Record<AgentStatus, () => string[]> = {
    paid: () => [
      `Paid: ${shop.spec.productName}${picked(shop, order.options)}, ${total}.`,
      order.access_code
        ? `Your access code: \`${order.access_code}\`${shop.access_url ? ` · ${link("Start now", withCode(shop.access_url, order.access_code))}` : ""}`
        : order.download_token
          ? `${link("Download it", `${appUrl()}/api/download/${order.download_token}`)} (works 5 times over 14 days)`
          : `Ships to ${[order.buyer_name, shipTo].filter(Boolean).join(", ") || "the address you gave PayPal"}.` +
            (order.tracking_number ? ` Tracking: ${order.carrier ?? ""} ${order.tracking_number}`.trimEnd() : ""),
      link("Your receipt", receiptUrl),
    ],
    awaiting_buyer_approval: () => ["Not paid yet.", `**${pay}**`],
    declined: () => ["PayPal declined the payment. Nothing was charged.", `**${pay}** to try another way.`],
    sold_out: () => ["It sold out before your payment went through. Nothing was charged."],
    expired: () => ["That checkout expired. Nothing was charged. Want me to start a new one?"],
    failed: () => ["I couldn't reach PayPal just now. I'll check again in a moment."],
    refunded: () => [`The seller refunded this order: ${total} back to your PayPal.`, link("Your receipt", receiptUrl)],
  };
  return {
    show_buyer: forBuyer[status]().join("\n"),
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
    total,
    ...(status === "paid"
      ? {
          paid_at: order.paid_at,
          receipt_url: receiptUrl,
          next_step: SHOW_BUYER,
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
                    ? { name: order.buyer_name, address: shipTo }
                    : null,
                  fulfillment: order.fulfillment_status,
                  tracking: order.tracking_number ? { carrier: order.carrier, number: order.tracking_number } : null,
                },
        }
      : {
          ...((status === "awaiting_buyer_approval" || status === "declined") && { pay_url: payUrl(order.id) }),
          next_step: `${NEXT_STEP[status]} ${SHOW_BUYER}`,
        }),
  };
}
