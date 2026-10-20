import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { newId } from "@/lib/ids";
import { createOrder, PayPalError, paypalEnabled } from "@/lib/paypal";
import { getShopBySlug } from "@/lib/shops";

/** Buyer clicked the PayPal button. The price comes from the database, never from the browser. */
export async function POST(req: Request) {
  if (!paypalEnabled()) return NextResponse.json({ error: "PayPal isn't configured." }, { status: 503 });
  const body = (await req.json().catch(() => null)) as { slug?: string } | null;
  const shop = body?.slug ? await getShopBySlug(body.slug) : null;
  if (!shop || shop.status !== "live") return NextResponse.json({ error: "Shop not found." }, { status: 404 });
  if (shop.stock !== null && shop.stock <= 0) return NextResponse.json({ error: "Sold out." }, { status: 409 });

  const localId = newId();
  const shipping = shop.product_type === "physical" ? shop.shipping_cents : 0;
  try {
    const pp = await createOrder(shop, localId);
    await query(
      `INSERT INTO orders (id, shop_id, paypal_order_id, amount_cents, shipping_cents, currency)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [localId, shop.id, pp.id, shop.price_cents + shipping, shipping, shop.currency],
    );
    return NextResponse.json({ id: pp.id });
  } catch (err) {
    console.error(err);
    const msg =
      err instanceof PayPalError && err.body.includes("PAYEE_ACCOUNT")
        ? "This shop's PayPal account can't receive payments yet."
        : "Couldn't start checkout. Please try again.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
