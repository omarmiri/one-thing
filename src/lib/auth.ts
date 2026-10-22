import "server-only";
import { NextResponse } from "next/server";
import { requestKey, type ApiKey } from "./apiKeys";
import { getOwnedShop, getShopBySlug, type Shop } from "./shops";

export const badKey = () =>
  NextResponse.json({ error: "That API key isn't valid. Check it, or make a new one on your account page." }, { status: 401 });

/**
 * A seller call: the shop's admin token (x-admin-token, from its private manage link), or a
 * platform API key (Authorization: Bearer) from the account that owns the shop. A shop that
 * isn't yours answers 404, like one that doesn't exist.
 */
export async function requireShop(
  req: Request,
  slug: string,
): Promise<{ shop: Shop; key?: ApiKey } | { error: NextResponse }> {
  const k = await requestKey(req);
  if (k && "invalid" in k) return { error: badKey() };
  if (k) {
    const shop = await getShopBySlug(slug);
    return shop && shop.account_id === k.key.account_id ? { shop, key: k.key } : { error: NextResponse.json({ error: "Not found" }, { status: 404 }) };
  }
  const shop = await getOwnedShop(slug, req.headers.get("x-admin-token"));
  return shop ? { shop } : { error: NextResponse.json({ error: "Not found" }, { status: 404 }) };
}
