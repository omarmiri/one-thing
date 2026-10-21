import { NextResponse } from "next/server";
import { startCheckout } from "@/lib/orders";
import { PayPalError, paypalEnabled } from "@/lib/paypal";
import { getShopBySlug } from "@/lib/shops";

/** Buyer clicked the PayPal button. The price comes from the database, never from the browser. */
export async function POST(req: Request) {
  if (!paypalEnabled()) return NextResponse.json({ error: "PayPal isn't configured." }, { status: 503 });
  const body = (await req.json().catch(() => null)) as { slug?: string } | null;
  const shop = body?.slug ? await getShopBySlug(body.slug) : null;
  if (!shop || shop.status !== "live") return NextResponse.json({ error: "Shop not found." }, { status: 404 });
  if (shop.product_type === "referral") return NextResponse.json({ error: "This product is bought at the retailer." }, { status: 400 });
  if (shop.stock !== null && shop.stock <= 0) return NextResponse.json({ error: "Sold out." }, { status: 409 });

  try {
    const { paypalOrderId } = await startCheckout(shop, "web");
    return NextResponse.json({ id: paypalOrderId });
  } catch (err) {
    console.error(err);
    const msg =
      err instanceof PayPalError && err.body.includes("PAYEE_ACCOUNT")
        ? "This shop's PayPal account can't receive payments yet."
        : "Couldn't start checkout. Please try again.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
