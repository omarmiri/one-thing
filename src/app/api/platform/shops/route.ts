import { NextResponse } from "next/server";
import { requestKey } from "@/lib/apiKeys";
import { badKey } from "@/lib/auth";
import { query } from "@/lib/db";
import { appUrl } from "@/lib/ids";
import { paypalReadyToPay } from "@/lib/paypal";
import { blobUrl, listAccountShops, shopPhotos } from "@/lib/shops";

/**
 * A platform's shops: everything its API key's account owns, newest first, with what a
 * catalog page needs. ?status=live for only the ones buyers can see.
 */
export async function GET(req: Request) {
  const k = await requestKey(req);
  if (!k) return NextResponse.json({ error: "Send your API key as Authorization: Bearer <key>." }, { status: 401 });
  if ("invalid" in k) return badKey();
  const status = new URL(req.url).searchParams.get("status");

  const shops = (await listAccountShops(k.key.account_id)).filter((s) => !status || s.status === status);
  const sales = new Map(
    (
      await query<{ shop_id: string; n: number }>(
        "SELECT shop_id, count(*)::int AS n FROM orders WHERE status = 'paid' AND shop_id IN (SELECT id FROM shops WHERE account_id = $1) GROUP BY shop_id",
        [k.key.account_id],
      )
    ).map((r) => [r.shop_id, r.n]),
  );
  return NextResponse.json({
    shops: shops.map((s) => {
      const cover = blobUrl(shopPhotos(s)[0] ?? s.hero_blob);
      return {
        slug: s.slug,
        status: s.status,
        name: s.spec.productName,
        headline: s.spec.headline,
        product_type: s.product_type,
        price: { amount: s.price_cents / 100, currency: s.currency },
        url: `${appUrl()}/${s.slug}`,
        cover: cover ? `${appUrl()}${cover}` : null,
        paypal_connected: paypalReadyToPay(s),
        sales: sales.get(s.id) ?? 0,
        created_at: s.created_at,
      };
    }),
  });
}
