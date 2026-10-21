import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { requireShop } from "@/lib/auth";
import { appUrl } from "@/lib/ids";
import { connectedMerchant, connectUrl, merchantStatus, PayPalError, paypalConnectEnabled } from "@/lib/paypal";
import { saveConnection, updateShop } from "@/lib/shops";
import { one } from "@/lib/db";

const off = () => NextResponse.json({ error: "Connect PayPal isn't set up on this server." }, { status: 503 });

/** Connect PayPal: the PayPal page the seller goes to. They come back through ./return. */
export async function POST(req: Request, ctx: RouteContext<"/api/shops/[slug]/paypal">) {
  if (!paypalConnectEnabled()) return off();
  const r = await requireShop(req, (await ctx.params).slug);
  if ("error" in r) return r.error;
  const { shop } = r;
  const account = shop.account_id ? await one<{ email: string | null }>("SELECT email FROM accounts WHERE id = $1", [shop.account_id]) : null;
  try {
    const url = await connectUrl(shop.id, `${appUrl()}/api/shops/${shop.slug}/paypal/return`, shop.paypal_email ?? shop.seller_email ?? account?.email);
    // PayPal's return can't carry the private manage link, so this browser remembers it.
    (await cookies()).set("ot_paypal_connect", JSON.stringify({ slug: shop.slug, token: shop.admin_token }), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: `/api/shops/${shop.slug}/paypal`,
      maxAge: 60 * 60,
    });
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Connect PayPal:", err);
    return NextResponse.json({ error: "PayPal couldn't start the connection just now. Try again." }, { status: 502 });
  }
}

/** Check again: asks PayPal where the seller's connection stands and saves it. */
export async function GET(req: Request, ctx: RouteContext<"/api/shops/[slug]/paypal">) {
  if (!paypalConnectEnabled()) return off();
  const r = await requireShop(req, (await ctx.params).slug);
  if ("error" in r) return r.error;
  const { shop } = r;
  try {
    // Connected already: refresh the status. Not yet: maybe they finished but never came back.
    const found = shop.paypal_merchant_id
      ? { merchantId: shop.paypal_merchant_id, status: await merchantStatus(shop.paypal_merchant_id) }
      : await connectedMerchant(shop.id);
    if (found) await saveConnection(shop, found.merchantId, found.status);
    return NextResponse.json({ merchantId: found?.merchantId ?? null, status: found?.status ?? null });
  } catch (err) {
    console.error("PayPal status:", err);
    const msg = err instanceof PayPalError && err.status < 500 ? "PayPal didn't recognise this connection." : "PayPal didn't answer just now. Try again.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

/** Disconnect: sales go back to the typed PayPal email (or the platform account in sandbox). */
export async function DELETE(req: Request, ctx: RouteContext<"/api/shops/[slug]/paypal">) {
  const r = await requireShop(req, (await ctx.params).slug);
  if ("error" in r) return r.error;
  await updateShop(r.shop.id, { paypal_merchant_id: null, paypal_status: null });
  return NextResponse.json({ ok: true });
}
