import { notFound } from "next/navigation";
import { getOrder, getShopBySlug, money } from "@/lib/shops";

export const dynamic = "force-dynamic";

export default async function Thanks(props: PageProps<"/s/[slug]/thanks">) {
  const { slug } = await props.params;
  const { order: orderId } = await props.searchParams;
  const shop = await getShopBySlug(slug);
  const order = typeof orderId === "string" ? await getOrder(orderId) : null;
  if (!shop || !order || order.shop_id !== shop.id) notFound();

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
        <a href={`/s/${shop.slug}`} className="mt-8 block text-sm underline" style={{ color: p.muted }}>
          Back to the shop
        </a>
      </div>
    </div>
  );
}
