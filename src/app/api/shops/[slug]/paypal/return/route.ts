import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { appUrl, tokensMatch } from "@/lib/ids";
import { connectedMerchant } from "@/lib/paypal";
import { getShopBySlug, saveConnection } from "@/lib/shops";

/**
 * PayPal sends the seller back here after onboarding. Its query string says who they are, but
 * anyone could type one, so we ask PayPal instead (by the shop id we sent as tracking_id). That
 * makes this safe to leave open: the worst a stranger can do is refresh a shop's real status.
 */
export async function GET(_req: Request, ctx: RouteContext<"/api/shops/[slug]/paypal/return">) {
  const shop = await getShopBySlug((await ctx.params).slug);
  if (!shop) return NextResponse.redirect(`${appUrl()}/account`);

  const jar = await cookies();
  const saved = jar.get("ot_paypal_connect")?.value;
  jar.delete({ name: "ot_paypal_connect", path: `/api/shops/${shop.slug}/paypal` });
  let token: string | null = null;
  try {
    const s = saved ? (JSON.parse(saved) as { slug: string; token: string }) : null;
    if (s && tokensMatch(s.token, shop.admin_token)) token = s.token;
  } catch {}

  let outcome = "failed";
  try {
    const found = await connectedMerchant(shop.paypal_tracking_id ?? shop.id);
    if (found) {
      await saveConnection(shop, found.merchantId, found.status);
      outcome = found.status.receivable && found.status.emailConfirmed ? "connected" : "incomplete";
    } else {
      outcome = "cancelled"; // they left PayPal's flow before finishing
    }
  } catch (err) {
    console.error("Connect PayPal return:", err);
  }
  // A platform's seller goes back to the platform (its URL was checked against the key).
  if (shop.paypal_return_url) {
    const back = new URL(shop.paypal_return_url);
    back.searchParams.set("paypal", outcome);
    back.searchParams.set("shop", shop.slug);
    return NextResponse.redirect(back.toString());
  }
  // Without the remembered link, the manage page still opens for a signed-in owner.
  const q = new URLSearchParams({ ...(token && { token }), paypal: outcome });
  return NextResponse.redirect(`${appUrl()}/manage/${shop.slug}?${q}`);
}
