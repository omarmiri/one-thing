import { NextResponse } from "next/server";
import { one } from "@/lib/db";
import { captureWithStock } from "@/lib/orders";
import type { Order } from "@/lib/shops";

/** Buyer approved in the PayPal popup → claim the unit, capture the money and record the sale. */
export async function POST(_req: Request, ctx: RouteContext<"/api/orders/[paypalOrderId]/capture">) {
  const { paypalOrderId } = await ctx.params;
  const order = await one<Order>("SELECT * FROM orders WHERE paypal_order_id = $1", [paypalOrderId]);
  if (!order) return NextResponse.json({ error: "Unknown order." }, { status: 404 });

  switch (await captureWithStock(order)) {
    case "paid":
      return NextResponse.json({ orderId: order.id, status: "paid" });
    // The shop page polls this while the PayPal window is open: not approved yet is normal.
    case "pending":
      return NextResponse.json({ status: "pending" }, { status: 409 });
    // Someone else got the last one between order and approval. Nothing was charged.
    case "sold_out":
      return NextResponse.json({ error: "Sorry, that just sold out. You haven't been charged." }, { status: 410 });
    // The v6 SDK lets the buyer pick another funding source and retry.
    case "declined":
      return NextResponse.json({ error: "INSTRUMENT_DECLINED" }, { status: 422 });
    default:
      return NextResponse.json({ error: "Couldn't complete the payment." }, { status: 502 });
  }
}
