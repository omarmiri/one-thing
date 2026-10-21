import { NextResponse } from "next/server";
import { clientToken, paypalEnabled } from "@/lib/paypal";

/** GET → { clientToken } for the PayPal JS SDK v6 on a shop page, bound to this site's domain. */
export async function GET(req: Request) {
  if (!paypalEnabled()) return NextResponse.json({ error: "PayPal isn't configured." }, { status: 503 });
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? new URL(req.url).host;
  try {
    const token = await clientToken(host.split(":")[0]);
    return NextResponse.json({ clientToken: token }, { headers: { "cache-control": "no-store" } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Couldn't start PayPal checkout." }, { status: 502 });
  }
}
