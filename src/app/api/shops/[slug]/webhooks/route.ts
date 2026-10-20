import { NextResponse } from "next/server";
import { requireShop } from "@/lib/auth";
import { listWebhookEvents } from "@/lib/shops";

export async function GET(req: Request, ctx: RouteContext<"/api/shops/[slug]/webhooks">) {
  const r = await requireShop(req, (await ctx.params).slug);
  if ("error" in r) return r.error;
  return NextResponse.json(await listWebhookEvents(r.shop.id));
}
