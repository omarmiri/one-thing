import "server-only";
import { one, query } from "./db";
import { newId } from "./ids";
import type { Capture } from "./paypal";
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
        download_token = CASE WHEN s.product_type = 'digital' THEN $6 ELSE NULL END
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
