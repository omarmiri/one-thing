import { NextResponse } from "next/server";
import { one, query } from "@/lib/db";
import { markPaid, markRefunded } from "@/lib/orders";
import { verifyWebhook } from "@/lib/paypal";

/**
 * PayPal webhook. In the developer dashboard, add <APP_URL>/api/paypal/webhook to the app with
 * at least PAYMENT.CAPTURE.COMPLETED (and PAYMENT.CAPTURE.REFUNDED, so a refund the seller makes in
 * PayPal shows here too), and put the webhook id in PAYPAL_WEBHOOK_ID.
 *
 * It's the safety net for buyers who close the tab between approving and our capture call
 * returning, and every delivery that belongs to a shop is logged to webhook_events so the
 * seller sees it on the manage page (signature verified or not, and what it changed).
 */

type Event = {
  id?: string;
  event_type?: string;
  summary?: string;
  resource?: {
    id?: string;
    amount?: { value?: string; currency_code?: string };
    supplementary_data?: { related_ids?: { order_id?: string } };
    links?: { rel: string; href: string }[];
  };
};

// A refund points back at its capture with rel "up": .../v2/payments/captures/<id>.
const refundedCaptureOf = (e: Event) => e.resource?.links?.find((l) => l.rel === "up")?.href.match(/\/captures\/([^/?]+)/)?.[1] ?? null;

// CHECKOUT.ORDER.* events carry the order itself; PAYMENT.CAPTURE.* carry it as a related id.
const orderIdOf = (e: Event) =>
  e.resource?.supplementary_data?.related_ids?.order_id ??
  (e.event_type?.startsWith("CHECKOUT.ORDER.") ? e.resource?.id : undefined) ??
  null;

export async function POST(req: Request) {
  const event = (await req.json().catch(() => null)) as Event | null;
  if (!event?.event_type) return NextResponse.json({ error: "bad body" }, { status: 400 });

  const verified = await verifyWebhook(req.headers, event).catch(() => false);
  const paypalOrderId = orderIdOf(event);
  const refunded = event.event_type === "PAYMENT.CAPTURE.REFUNDED" ? refundedCaptureOf(event) : null;
  const order = paypalOrderId
    ? await one<{ id: string; shop_id: string; status: string }>("SELECT id, shop_id, status FROM orders WHERE paypal_order_id = $1", [paypalOrderId])
    : refunded
      ? await one<{ id: string; shop_id: string; status: string }>("SELECT id, shop_id, status FROM orders WHERE capture_id = $1", [refunded])
      : null;

  let outcome = "Logged";
  if (!verified) outcome = "Rejected: signature did not verify";
  else if (event.event_type === "PAYMENT.CAPTURE.COMPLETED" && paypalOrderId) {
    if (order?.status === "paid") outcome = "Confirmed: order already paid";
    else if (order) {
      await markPaid(paypalOrderId);
      outcome = "Marked the order paid";
    } else outcome = "No matching order";
  } else if (event.event_type === "PAYMENT.CAPTURE.REFUNDED" && order) {
    // Our own Refund button gets here too, after the order is already marked.
    outcome = (await markRefunded(order.id, event.resource?.id ?? null)) ? "Marked the order refunded" : "Confirmed: order already refunded";
  }

  // Only log what belongs to a shop: unverified noise from the internet never reaches the table.
  if (order) {
    const amount = event.resource?.amount;
    await query(
      `INSERT INTO webhook_events (id, shop_id, event_type, paypal_order_id, summary, verified, outcome)
       VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING`,
      [
        event.id ?? `${event.event_type}-${paypalOrderId}-${Date.now()}`,
        order.shop_id,
        event.event_type,
        paypalOrderId,
        amount?.value ? `${amount.value} ${amount.currency_code ?? ""}`.trim() : (event.summary ?? null),
        verified,
        outcome,
      ],
    );
  }

  return verified
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: "unverified" }, { status: 401 });
}
