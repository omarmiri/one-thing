import "server-only";
import { NextResponse } from "next/server";
import { getOwnedShop, type Shop } from "./shops";

// Week 1 auth: the seller's private manage link carries an admin token; the manage page sends
// it back as x-admin-token. Real accounts (or PayPal login) come later.
export async function requireShop(
  req: Request,
  slug: string,
): Promise<{ shop: Shop } | { error: NextResponse }> {
  const shop = await getOwnedShop(slug, req.headers.get("x-admin-token"));
  return shop ? { shop } : { error: NextResponse.json({ error: "Not found" }, { status: 404 }) };
}
