import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { toOrigin } from "@/lib/apiKeys";
import { requireShop } from "@/lib/auth";
import { appUrl, newId } from "@/lib/ids";
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
  // A platform sends its seller back to its own page: only with its key, and only to an origin
  // registered on the key, so this can't be turned into an open redirect.
  const body = (await req.json().catch(() => null)) as { returnUrl?: unknown } | null;
  if (body?.returnUrl !== undefined) {
    const url = typeof body.returnUrl === "string" ? body.returnUrl : "";
    const origin = toOrigin(url);
    if (!r.key) return NextResponse.json({ error: "returnUrl needs a platform API key.", field: "returnUrl" }, { status: 400 });
    if (!origin || !r.key.return_origins.includes(origin)) {
      return NextResponse.json({ error: `returnUrl must be on an origin registered for this API key (${r.key.return_origins.join(", ") || "none yet"}).`, field: "returnUrl" }, { status: 400 });
    }
    await updateShop(shop.id, { paypal_return_url: url });
  }
  // A platform's seller isn't the account owner, so don't prefill the owner's email.
  const account = shop.account_id && !shop.api_key_id ? await one<{ email: string | null }>("SELECT email FROM accounts WHERE id = $1", [shop.account_id]) : null;
  try {
    // A fresh tracking_id per attempt: PayPal answers a reused one with whoever onboarded first,
    // so connecting a different account (say, one whose email is confirmed) would never take.
    const trackingId = `${shop.id}-${newId(6)}`;
    const url = await connectUrl(trackingId, `${appUrl()}/api/shops/${shop.slug}/paypal/return`, shop.paypal_email ?? shop.seller_email ?? account?.email);
    await updateShop(shop.id, { paypal_tracking_id: trackingId });
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
    // The latest attempt first: they may have finished it (perhaps with a different account)
    // without coming back. Otherwise refresh the account already connected.
    const latest = await connectedMerchant(shop.paypal_tracking_id ?? shop.id);
    const found =
      latest ??
      (shop.paypal_merchant_id ? { merchantId: shop.paypal_merchant_id, status: await merchantStatus(shop.paypal_merchant_id) } : null);
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
