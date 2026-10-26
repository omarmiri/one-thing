import "server-only";
import { one, query } from "./db";
import { accessCode, newId } from "./ids";
import { comboKey, isCompleteChoice, stockOf, type Choice } from "./options";
import { approveLink, captureOrder, createOrder, orderStatus, PayPalError, type Capture } from "./paypal";
import type { Order, Shop } from "./shops";
import { notifyZapier } from "./zapier";

/**
 * Marks an order paid. Called from the capture route and from the webhook, in either order —
 * only the first call flips the status, so stock, download links and Zapier fire exactly once.
 */
export async function markPaid(paypalOrderId: string, capture?: Capture): Promise<Order | null> {
  const unit = capture?.purchase_units?.[0];
  const cap = unit?.payments?.captures?.[0];
  const name = [capture?.payer?.name?.given_name, capture?.payer?.name?.surname].filter(Boolean).join(" ");

  const order = await one<Order & { product_type: Shop["product_type"] }>(
    `UPDATE orders o SET
        status = 'paid',
        paid_at = now(),
        capture_id = COALESCE($2, o.capture_id),
        buyer_email = COALESCE($3, o.buyer_email),
        buyer_name = COALESCE($4, o.buyer_name),
        shipping_address = COALESCE($5::jsonb, o.shipping_address),
        fulfillment_status = CASE WHEN s.product_type = 'digital' THEN 'digital_sent' ELSE 'to_ship' END,
        download_token = CASE WHEN s.product_type = 'digital' AND s.delivery = 'file' THEN $6 ELSE NULL END,
        access_code = CASE WHEN s.product_type = 'digital' AND s.delivery = 'access_code' THEN $7 ELSE NULL END
      FROM shops s
      WHERE o.shop_id = s.id AND o.paypal_order_id = $1 AND o.status <> 'paid'
      RETURNING o.*, s.product_type`,
    [
      paypalOrderId,
      cap?.id ?? null,
      capture?.payer?.email_address ?? null,
      unit?.shipping?.name?.full_name || name || null,
      unit?.shipping?.address ? JSON.stringify(unit.shipping.address) : null,
      newId(24),
      accessCode(),
    ],
  );

  if (!order) {
    // Already paid by the other path: still fill in details a webhook-first payment lacked.
    if (capture) {
      await query(
        `UPDATE orders SET capture_id = COALESCE(capture_id, $2), buyer_email = COALESCE(buyer_email, $3),
           shipping_address = COALESCE(shipping_address, $4::jsonb) WHERE paypal_order_id = $1`,
        [paypalOrderId, cap?.id ?? null, capture.payer?.email_address ?? null,
         unit?.shipping?.address ? JSON.stringify(unit.shipping.address) : null],
      );
    }
    return one<Order>("SELECT * FROM orders WHERE paypal_order_id = $1", [paypalOrderId]);
  }

  // Stock was already taken when the payment was captured (captureWithStock).
  const shop = await one<Shop>("SELECT * FROM shops WHERE id = $1", [order.shop_id]);
  if (shop) void notifyZapier(shop, "order.paid", order);
  return order;
}

export class CheckoutError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

/**
 * Starts a PayPal order for one unit. The price comes from the database, never the caller.
 * channel says who started it: the shop page ("web") or an AI agent through the MCP server.
 * choice is the buyer's pick when the shop has options (size, color…). agent names which agent
 * started it, for the seller's grid and stats.
 */
export async function startCheckout(shop: Shop, channel: "web" | "agent", choice?: unknown, agent?: string) {
  const options = shop.product_type === "physical" ? (shop.options ?? []) : [];
  let picked: Choice | null = null;
  if (options.length) {
    if (!isCompleteChoice(options, choice)) {
      throw new CheckoutError(`Choose ${options.map((o) => o.name.toLowerCase()).join(" and ")} first.`);
    }
    picked = Object.fromEntries(options.map((o) => [o.name, choice[o.name]]));
    if (stockOf(shop.option_stock ?? {}, comboKey(options, picked)) === 0) throw new CheckoutError(`${comboKey(options, picked)} is sold out.`, 409);
  } else if (shop.stock !== null && shop.stock <= 0) {
    throw new CheckoutError("Sold out.", 409);
  }
  const localId = newId();
  const shipping = shop.product_type === "physical" ? shop.shipping_cents : 0;
  const pp = await createOrder(shop, localId, picked ? comboKey(options, picked) : undefined);
  await query(
    `INSERT INTO orders (id, shop_id, paypal_order_id, amount_cents, shipping_cents, currency, channel, agent, options)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      localId,
      shop.id,
      pp.id,
      shop.price_cents + shipping,
      shipping,
      shop.currency,
      channel,
      channel === "agent" ? (agent ?? null) : null,
      picked ? JSON.stringify(picked) : null,
    ],
  );
  return {
    localId,
    paypalOrderId: pp.id,
    approveUrl: approveLink(pp),
    amountCents: shop.price_cents + shipping,
    choice: picked,
  };
}

// ---- Stock is taken before the money is ----------------------------------------------------------
// Two buyers can race for the last unit. Each capture first claims a unit in one atomic UPDATE;
// only the buyer who got it is charged. The other's PayPal order is never captured, so PayPal never
// takes their money, and it expires on its own.

type StockRef = { shopId: string; key: string | null }; // key: the option combination, null = shop stock

async function stockRef(order: Order): Promise<StockRef> {
  const shop = await one<Pick<Shop, "options" | "product_type">>("SELECT options, product_type FROM shops WHERE id = $1", [order.shop_id]);
  const options = shop?.product_type === "physical" ? (shop.options ?? []) : [];
  return { shopId: order.shop_id, key: options.length && order.options ? comboKey(options, order.options) : null };
}

/** Claims one unit. False when it's sold out. Unlimited stock always succeeds. */
async function takeUnit(ref: StockRef): Promise<boolean> {
  if (ref.key === null) {
    const s = await one<{ stock: number | null }>("SELECT stock FROM shops WHERE id = $1", [ref.shopId]);
    if (s?.stock === null || s?.stock === undefined) return true;
    return Boolean(await one("UPDATE shops SET stock = stock - 1 WHERE id = $1 AND stock > 0 RETURNING id", [ref.shopId]));
  }
  const s = await one<{ n: unknown }>("SELECT option_stock -> $2 AS n FROM shops WHERE id = $1", [ref.shopId, ref.key]);
  if (typeof s?.n !== "number") return true;
  return Boolean(
    await one(
      `UPDATE shops SET option_stock = jsonb_set(option_stock, ARRAY[$2::text], to_jsonb((option_stock ->> $2)::int - 1))
        WHERE id = $1 AND jsonb_typeof(option_stock -> $2) = 'number' AND (option_stock ->> $2)::int > 0 RETURNING id`,
      [ref.shopId, ref.key],
    ),
  );
}

/** Gives back a unit claimed for a payment that didn't go through. */
async function returnUnit(ref: StockRef) {
  if (ref.key === null) {
    await query("UPDATE shops SET stock = stock + 1 WHERE id = $1 AND stock IS NOT NULL", [ref.shopId]);
  } else {
    await query(
      `UPDATE shops SET option_stock = jsonb_set(option_stock, ARRAY[$2::text], to_jsonb((option_stock ->> $2)::int + 1))
        WHERE id = $1 AND jsonb_typeof(option_stock -> $2) = 'number'`,
      [ref.shopId, ref.key],
    );
  }
}

export type CaptureOutcome = "paid" | "pending" | "declined" | "sold_out" | "expired" | "failed";

/**
 * The one way an order gets captured: the shop page's popup and poll, the thank-you page and the
 * agent tools all come here. Claims stock first, captures, and gives the unit back if PayPal
 * doesn't take the money. "pending" means the buyer hasn't approved yet (or another call is
 * capturing it right now); "expired" means PayPal voided or dropped the order before payment.
 */
export async function captureWithStock(order: Order): Promise<CaptureOutcome> {
  if (order.status === "paid") return "paid";
  if (!order.paypal_order_id) return "failed";
  // Only approved orders are worth claiming stock for; the poll asks every few seconds.
  const at = await orderStatus(order.paypal_order_id).catch(() => null);
  if (at === "VOIDED" || at === "EXPIRED") return "expired";
  if (at !== "APPROVED") return at === null ? "failed" : "pending";

  const ref = await stockRef(order);
  if (!(await takeUnit(ref))) return "sold_out";
  try {
    const cap = await captureOrder(order.paypal_order_id);
    const c = cap.purchase_units?.[0]?.payments?.captures?.[0];
    if (cap.status !== "COMPLETED" || !c || c.status === "DECLINED") {
      await returnUnit(ref);
      return "declined";
    }
    // PENDING captures (e.g. eCheck) still count as a sale; the webhook confirms them later.
    await markPaid(order.paypal_order_id, cap);
    return "paid";
  } catch (err) {
    await returnUnit(ref);
    if (err instanceof PayPalError && err.body.includes("ORDER_ALREADY_CAPTURED")) {
      const now = await one<Order>("SELECT status FROM orders WHERE id = $1", [order.id]);
      return now?.status === "paid" ? "paid" : "pending";
    }
    if (err instanceof PayPalError && err.body.includes("ORDER_NOT_APPROVED")) return "pending";
    if (err instanceof PayPalError && err.body.includes("INSTRUMENT_DECLINED")) return "declined";
    console.error("capture failed:", err);
    return "failed";
  }
}

/** Captures if the buyer approved, and returns the order as it stands afterwards. */
export async function captureIfApproved(order: Order): Promise<Order> {
  if (order.status === "paid" || !order.paypal_order_id) return order;
  await captureWithStock(order);
  return (await one<Order>("SELECT * FROM orders WHERE id = $1", [order.id])) ?? order;
}
