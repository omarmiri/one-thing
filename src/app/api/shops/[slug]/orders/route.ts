import { NextResponse } from "next/server";
import { requireShop } from "@/lib/auth";
import { listOrders } from "@/lib/shops";

export async function GET(req: Request, ctx: RouteContext<"/api/shops/[slug]/orders">) {
  const r = await requireShop(req, (await ctx.params).slug);
  if ("error" in r) return r.error;
  // Abandoned checkouts (never approved) are noise for the seller.
  const orders = (await listOrders(r.shop.id)).filter((o) => o.status !== "created");
  return NextResponse.json(orders.map(({ download_token: _d, ...o }) => o));
}
