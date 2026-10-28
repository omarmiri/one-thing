import { NextResponse } from "next/server";
import { CheckoutError, startCheckout } from "@/lib/orders";
import { PayPalError, paypalEnabled } from "@/lib/paypal";
import { limited } from "@/lib/rateLimit";
import { getShopBySlug } from "@/lib/shops";

/** Buyer clicked the PayPal button. The price comes from the database, never from the browser. */
export async function POST(req: Request) {
  if (!paypalEnabled()) return NextResponse.json({ error: "PayPal isn't configured." }, { status: 503 });
  const busy = await limited("order", req.headers);
  if (busy) return busy;
  const body = (await req.json().catch(() => null)) as { slug?: string; options?: unknown } | null;
  const shop = body?.slug ? await getShopBySlug(body.slug) : null;
  if (!shop || shop.status !== "live") return NextResponse.json({ error: "Shop not found." }, { status: 404 });
  if (shop.product_type === "referral") return NextResponse.json({ error: "This product is bought at the retailer." }, { status: 400 });

  try {
    const { paypalOrderId } = await startCheckout(shop, "web", body?.options);
    return NextResponse.json({ id: paypalOrderId });
  } catch (err) {
    if (err instanceof CheckoutError) return NextResponse.json({ error: err.message }, { status: err.status });
    console.error(err);
    const msg =
      err instanceof PayPalError && err.body.includes("PAYEE_ACCOUNT")
        ? "This shop's PayPal account can't receive payments yet."
        : "Couldn't start checkout. Please try again.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
