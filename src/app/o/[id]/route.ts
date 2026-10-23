import { NextResponse } from "next/server";
import { one } from "@/lib/db";
import { appUrl } from "@/lib/ids";
import { captureIfApproved } from "@/lib/orders";
import { approveLink, getPayPalOrder } from "@/lib/paypal";
import { getOrder } from "@/lib/shops";

/**
 * An order's pay link, /o/<order id>: what agents hand the buyer instead of PayPal's approval URL.
 * PayPal's URL carries a checkout token that agent platforms treat as a secret and hide, so it
 * stays here and the buyer is redirected to it. Paid orders go to the receipt; an expired
 * checkout goes back to the shop page to start again.
 */
export async function GET(_req: Request, ctx: RouteContext<"/o/[id]">) {
  const { id } = await ctx.params;
  const order = await getOrder(id);
  const shop = order && (await one<{ slug: string }>("SELECT slug FROM shops WHERE id = $1", [order.shop_id]));
  if (!order || !shop) return new Response("No order with that id.", { status: 404 });

  const go = (url: string) => NextResponse.redirect(url, { status: 303, headers: { "cache-control": "no-store" } });
  const receipt = `${appUrl()}/${shop.slug}/thanks?order=${order.id}`;
  if (order.status === "paid") return go(receipt);
  if (!order.paypal_order_id) return go(`${appUrl()}/${shop.slug}`);

  const pp = await getPayPalOrder(order.paypal_order_id);
  if (!pp || pp.status === "VOIDED") return go(`${appUrl()}/${shop.slug}`);
  // Approved but not yet captured (the buyer closed PayPal before the hand-back): finish it now.
  if (pp.status === "APPROVED" || pp.status === "COMPLETED") {
    await captureIfApproved(order);
    return go(receipt);
  }
  return go(approveLink(pp) ?? `${appUrl()}/${shop.slug}`);
}
