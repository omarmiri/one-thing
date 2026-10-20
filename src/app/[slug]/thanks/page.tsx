import { notFound } from "next/navigation";
import { markPaid } from "@/lib/orders";
import { captureOrder } from "@/lib/paypal";
import { getOrder, getShopBySlug, money, type Order } from "@/lib/shops";

export const dynamic = "force-dynamic";

function withCode(url: string, code: string) {
  const u = new URL(url);
  u.searchParams.set("code", code);
  return u.toString();
}

export default async function Thanks(props: PageProps<"/[slug]/thanks">) {
  const { slug } = await props.params;
  const { order: orderId, token } = await props.searchParams;
  const shop = await getShopBySlug(slug);
  let order = typeof orderId === "string" ? await getOrder(orderId) : null;
  if (!shop || !order || order.shop_id !== shop.id) notFound();

  // Phones often come back from PayPal by redirect (return_url + ?token=<PayPal order id>)
  // rather than through the popup callback, so nothing has captured the payment yet. Do it here.
  if (order.status !== "paid" && typeof token === "string" && token === order.paypal_order_id) {
    order = (await captureOnReturn(order)) ?? order;
  }

  const p = shop.spec.palette;
  const paid = order.status === "paid";
  const addr = order.shipping_address;
  return (
    <div className="min-h-screen px-4 py-16" style={{ background: p.background, color: p.text }}>
      <div className="mx-auto max-w-lg rounded-2xl p-8 text-center shadow-lg" style={{ background: p.surface }}>
        <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: p.accent }}>
          {paid ? "Payment received" : "Almost there"}
        </p>
        <h1 className="mt-3 text-3xl font-bold">{paid ? "Thank you!" : "We're confirming your payment"}</h1>
        <p className="mt-3" style={{ color: p.muted }}>
          {shop.spec.productName} · {money(order.amount_cents, order.currency)}
        </p>

        {paid && order.download_token && (
          <a
            href={`/api/download/${order.download_token}`}
            className="mt-8 inline-block rounded-full px-8 py-4 font-bold"
            style={{ background: p.accent, color: p.accentText }}
          >
            Download your file
          </a>
        )}
        {paid && order.download_token && (
          <p className="mt-3 text-sm" style={{ color: p.muted }}>
            Bookmark this page — the link works 5 times over the next 14 days.
          </p>
        )}

        {paid && order.access_code && (
          <div className="mt-8 space-y-4">
            <div className="rounded-xl p-5" style={{ background: p.background }}>
              <p className="text-sm" style={{ color: p.muted }}>Your access code</p>
              <p className="mt-1 select-all font-mono text-3xl font-bold tracking-wider">{order.access_code}</p>
            </div>
            {shop.access_url && (
              <a
                href={withCode(shop.access_url, order.access_code)}
                className="inline-block rounded-full px-8 py-4 font-bold"
                style={{ background: p.accent, color: p.accentText }}
              >
                Start now
              </a>
            )}
            <p className="text-sm" style={{ color: p.muted }}>
              Keep this code. It works on any device. On iPhone, open the link in Safari and tap Share → Add to Home
              Screen to install it like an app; the installed app asks for the code once.
            </p>
          </div>
        )}

        {paid && shop.product_type === "physical" && (
          <div className="mt-8 rounded-xl p-5 text-left" style={{ background: p.background }}>
            <p className="font-semibold">Shipping to</p>
            {addr ? (
              <p className="mt-1" style={{ color: p.muted }}>
                {order.buyer_name}
                <br />
                {[addr.address_line_1, addr.address_line_2, addr.admin_area_2, addr.admin_area_1, addr.postal_code, addr.country_code]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            ) : (
              <p className="mt-1" style={{ color: p.muted }}>The address on your PayPal account.</p>
            )}
            <p className="mt-3 text-sm" style={{ color: p.muted }}>
              {order.tracking_number
                ? `Shipped with ${order.carrier} · tracking ${order.tracking_number}`
                : "You'll see the tracking number in your PayPal activity when it ships."}
            </p>
          </div>
        )}

        {!paid && (
          <p className="mt-6 text-sm" style={{ color: p.muted }}>
            Refresh in a moment. If you were charged, PayPal will confirm it shortly.
          </p>
        )}
        <a href={`/${shop.slug}`} className="mt-8 block text-sm underline" style={{ color: p.muted }}>
          Back to the shop
        </a>
      </div>
    </div>
  );
}

async function captureOnReturn(order: Order): Promise<Order | null> {
  try {
    const cap = await captureOrder(order.paypal_order_id!);
    const c = cap.purchase_units?.[0]?.payments?.captures?.[0];
    if (cap.status !== "COMPLETED" || !c || c.status === "DECLINED") return null;
    await markPaid(order.paypal_order_id!, cap);
    return getOrder(order.id);
  } catch (err) {
    console.error("capture on return failed:", err);
    return null;
  }
}
