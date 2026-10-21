import "server-only";
import { one, query } from "./db";
import { accessCode, newId } from "./ids";
import { captureOrder, createOrder, PayPalError, type Capture } from "./paypal";
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

  const shop = await one<Shop>(
    `UPDATE shops SET stock = GREATEST(stock - 1, 0) WHERE id = $1 AND stock IS NOT NULL RETURNING *`,
    [order.shop_id],
  ) ?? (await one<Shop>("SELECT * FROM shops WHERE id = $1", [order.shop_id]));
  if (shop) void notifyZapier(shop, "order.paid", order);
  return order;
}

/**
 * Starts a PayPal order for one unit. The price comes from the database, never the caller.
 * channel says who started it: the shop page ("web") or an AI agent through the MCP server.
 */
export async function startCheckout(shop: Shop, channel: "web" | "agent") {
  const localId = newId();
  const shipping = shop.product_type === "physical" ? shop.shipping_cents : 0;
  const pp = await createOrder(shop, localId);
  await query(
    `INSERT INTO orders (id, shop_id, paypal_order_id, amount_cents, shipping_cents, currency, channel)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [localId, shop.id, pp.id, shop.price_cents + shipping, shipping, shop.currency, channel],
  );
  return {
    localId,
    paypalOrderId: pp.id,
    approveUrl: pp.links?.find((l) => l.rel === "payer-action" || l.rel === "approve")?.href ?? null,
    amountCents: shop.price_cents + shipping,
  };
}

/**
 * Captures an order the buyer approved at PayPal but nothing has captured yet (they came back by
 * redirect, or an agent is checking). Returns the order as it stands afterwards; a not-yet-approved
 * order just comes back unpaid.
 */
export async function captureIfApproved(order: Order): Promise<Order> {
  if (order.status === "paid" || !order.paypal_order_id) return order;
  try {
    const cap = await captureOrder(order.paypal_order_id);
    const c = cap.purchase_units?.[0]?.payments?.captures?.[0];
    if (cap.status === "COMPLETED" && c && c.status !== "DECLINED") await markPaid(order.paypal_order_id, cap);
  } catch (err) {
    if (!(err instanceof PayPalError && /ORDER_NOT_APPROVED|ORDER_ALREADY_CAPTURED/.test(err.body))) {
      console.error("capture failed:", err);
    }
  }
  return (await one<Order>("SELECT * FROM orders WHERE id = $1", [order.id])) ?? order;
}
