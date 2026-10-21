import { NextResponse } from "next/server";
import { one } from "@/lib/db";
import { markPaid } from "@/lib/orders";
import { captureOrder, PayPalError } from "@/lib/paypal";
import type { Order } from "@/lib/shops";

/** Buyer approved in the PayPal popup → capture the money and record the sale. */
export async function POST(_req: Request, ctx: RouteContext<"/api/orders/[paypalOrderId]/capture">) {
  const { paypalOrderId } = await ctx.params;
  const order = await one<Order>("SELECT * FROM orders WHERE paypal_order_id = $1", [paypalOrderId]);
  if (!order) return NextResponse.json({ error: "Unknown order." }, { status: 404 });
  if (order.status === "paid") return NextResponse.json({ orderId: order.id, status: "paid" });

  try {
    const capture = await captureOrder(paypalOrderId);
    const cap = capture.purchase_units?.[0]?.payments?.captures?.[0];
    if (capture.status !== "COMPLETED" || !cap || cap.status === "DECLINED") {
      return NextResponse.json({ error: "The payment didn't go through.", status: capture.status }, { status: 402 });
    }
    // PENDING captures (e.g. eCheck) still count as a sale; the webhook confirms them later.
    await markPaid(paypalOrderId, capture);
    return NextResponse.json({ orderId: order.id, status: "paid" });
  } catch (err) {
    // The shop page polls this while the PayPal window is open: not approved yet is normal.
    if (err instanceof PayPalError && err.body.includes("ORDER_NOT_APPROVED")) {
      return NextResponse.json({ status: "pending" }, { status: 409 });
    }
    // Captured by the other path (popup callback vs. poll) a moment ago.
    if (err instanceof PayPalError && err.body.includes("ORDER_ALREADY_CAPTURED")) {
      const now = await one<Order>("SELECT * FROM orders WHERE id = $1", [order.id]);
      if (now?.status === "paid") return NextResponse.json({ orderId: order.id, status: "paid" });
      return NextResponse.json({ status: "pending" }, { status: 409 });
    }
    console.error(err);
    if (err instanceof PayPalError && err.body.includes("INSTRUMENT_DECLINED")) {
      // The v6 SDK lets the buyer pick another funding source and retry.
      return NextResponse.json({ error: "INSTRUMENT_DECLINED" }, { status: 422 });
    }
    return NextResponse.json({ error: "Couldn't complete the payment." }, { status: 502 });
  }
}
