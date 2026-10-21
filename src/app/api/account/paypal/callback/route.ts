import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { currentAccount, signInWithPayPal, startSession } from "@/lib/accounts";
import { appUrl } from "@/lib/ids";
import { paypalIdentity } from "@/lib/paypal";

/** PayPal sends the seller back here with ?code&state (or ?error). Sign them in and carry on. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const jar = await cookies();
  const saved = jar.get("ot_paypal_state")?.value;
  jar.delete({ name: "ot_paypal_state", path: "/api/account/paypal" });
  let next = "/account";
  const fail = (why: string) => NextResponse.redirect(`${appUrl()}/account?paypal=${why}`);

  try {
    const s = saved ? (JSON.parse(saved) as { state: string; next: string }) : null;
    if (!s || s.state !== url.searchParams.get("state")) return fail("expired");
    next = s.next;
  } catch {
    return fail("expired");
  }
  const code = url.searchParams.get("code");
  if (!code) return fail("cancelled"); // the seller closed PayPal's window or said no

  try {
    const identity = await paypalIdentity(code);
    const account = await signInWithPayPal(identity, await currentAccount());
    await startSession(account.id);
    return NextResponse.redirect(`${appUrl()}${next}`);
  } catch (e) {
    console.error(e);
    return fail("failed");
  }
}
