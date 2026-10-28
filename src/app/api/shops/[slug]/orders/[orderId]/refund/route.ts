import { NextResponse } from "next/server";
import { requireShop } from "@/lib/auth";
import { one } from "@/lib/db";
import { markRefunded, RefundError, refundOrder } from "@/lib/orders";
import type { Order } from "@/lib/shops";
import { notifyZapier } from "@/lib/zapier";

/**
 * Seller refunds a paid order in full through PayPal. With {"record": true} nothing goes to
 * PayPal: the seller already refunded it in their own PayPal account (the only way when the
 * money went to an email they typed) and this just marks it refunded here.
 */
export async function POST(req: Request, ctx: RouteContext<"/api/shops/[slug]/orders/[orderId]/refund">) {
  const { slug, orderId } = await ctx.params;
  const r = await requireShop(req, slug);
  if ("error" in r) return r.error;
  const record = ((await req.json().catch(() => null)) as { record?: unknown } | null)?.record === true;

  const order = await one<Order>("SELECT * FROM orders WHERE id = $1 AND shop_id = $2", [orderId, r.shop.id]);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  try {
    const done = record
      ? await markRefunded(order.id, null)
      : await refundOrder(order, r.shop);
    if (!done) return NextResponse.json({ error: "Only paid orders can be refunded." }, { status: 409 });
    void notifyZapier(r.shop, "order.refunded", done);
    return NextResponse.json({ ok: true, refundId: done.refund_id });
  } catch (err) {
    if (err instanceof RefundError) return NextResponse.json({ error: err.message, refundInPayPal: err.payee }, { status: 409 });
    throw err;
  }
}
