import { NextResponse } from "next/server";
import { markPaid } from "@/lib/orders";
import { verifyWebhook } from "@/lib/paypal";

/**
 * PayPal webhook (subscribe to PAYMENT.CAPTURE.COMPLETED in the developer dashboard and put the
 * webhook id in PAYPAL_WEBHOOK_ID). It's the safety net for buyers who close the tab between
 * approving and our capture call returning.
 */
export async function POST(req: Request) {
  const event = (await req.json().catch(() => null)) as {
    event_type?: string;
    resource?: { supplementary_data?: { related_ids?: { order_id?: string } } };
  } | null;
  if (!event) return NextResponse.json({ error: "bad body" }, { status: 400 });
  if (!(await verifyWebhook(req.headers, event).catch(() => false))) {
    return NextResponse.json({ error: "unverified" }, { status: 401 });
  }
  if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
    const orderId = event.resource?.supplementary_data?.related_ids?.order_id;
    if (orderId) await markPaid(orderId);
  }
  return NextResponse.json({ ok: true });
}
