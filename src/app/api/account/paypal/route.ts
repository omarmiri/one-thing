import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { newId } from "@/lib/ids";
import { paypalLoginEnabled, paypalLoginUrl } from "@/lib/paypal";

/** GET ?next=/path → off to PayPal to sign in; the callback brings the seller back to next. */
export async function GET(req: Request) {
  if (!paypalLoginEnabled()) return NextResponse.json({ error: "Log in with PayPal isn't switched on." }, { status: 503 });
  const next = new URL(req.url).searchParams.get("next");
  const state = newId(18);
  // The state comes back from PayPal; matching it to this cookie proves the round trip started here.
  (await cookies()).set("ot_paypal_state", JSON.stringify({ state, next: next?.startsWith("/") && !next.startsWith("//") ? next : "/account" }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/api/account/paypal",
    maxAge: 600,
  });
  return NextResponse.redirect(paypalLoginUrl(state));
}
