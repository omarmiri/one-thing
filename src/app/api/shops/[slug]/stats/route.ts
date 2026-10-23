import { NextResponse } from "next/server";
import { requireShop } from "@/lib/auth";
import { getStats } from "@/lib/stats";

/** The seller's funnel: visitors → checkouts started → paid, people vs AI agents. ?days=7|30|90 */
export async function GET(req: Request, ctx: RouteContext<"/api/shops/[slug]/stats">) {
  const r = await requireShop(req, (await ctx.params).slug);
  if ("error" in r) return r.error;
  const days = [7, 30, 90].includes(Number(new URL(req.url).searchParams.get("days"))) ? Number(new URL(req.url).searchParams.get("days")) : 30;
  return NextResponse.json({ ...(await getStats(r.shop.id, days)), currency: r.shop.currency });
}
