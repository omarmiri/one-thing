import { NextResponse } from "next/server";
import { z } from "zod";
import { requireShop } from "@/lib/auth";
import { one } from "@/lib/db";
import { addTracking, CARRIERS } from "@/lib/paypal";
import type { Order } from "@/lib/shops";
import { notifyZapier } from "@/lib/zapier";

const Body = z.object({
  carrier: z.enum(CARRIERS),
  carrierName: z.string().max(60).optional(),
  trackingNumber: z.string().trim().min(4).max(64),
});

/** Seller marks a physical order shipped; the tracking number is pushed to PayPal for the buyer. */
export async function POST(req: Request, ctx: RouteContext<"/api/shops/[slug]/orders/[orderId]/ship">) {
  const { slug, orderId } = await ctx.params;
  const r = await requireShop(req, slug);
  if ("error" in r) return r.error;
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a carrier and tracking number." }, { status: 400 });
  const t = parsed.data;

  const order = await one<Order>(
    `UPDATE orders SET fulfillment_status = 'shipped', carrier = $3, tracking_number = $4
      WHERE id = $1 AND shop_id = $2 AND status = 'paid' RETURNING *`,
    [orderId, r.shop.id, t.carrier === "OTHER" ? t.carrierName || "OTHER" : t.carrier, t.trackingNumber],
  );
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  // Best-effort: the order is shipped either way. PayPal may refuse tracking on orders paid to
  // another merchant's account (payee by email), so the dashboard shows whether it synced.
  let synced = false;
  if (order.paypal_order_id && order.capture_id) {
    try {
      await addTracking(order.paypal_order_id, { captureId: order.capture_id, ...t });
      synced = true;
      await one("UPDATE orders SET tracking_synced = true WHERE id = $1", [order.id]);
    } catch (err) {
      console.warn((err as Error).message);
    }
  }
  void notifyZapier(r.shop, "order.shipped", order);
  return NextResponse.json({ ok: true, synced });
}
