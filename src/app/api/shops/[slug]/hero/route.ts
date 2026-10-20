import { after, NextResponse } from "next/server";
import { requireShop } from "@/lib/auth";
import { geminiEnabled } from "@/lib/gemini";
import { generateHero } from "@/lib/hero";
import { updateShop } from "@/lib/shops";

/** Regenerate the hero art (after a refine, or if the first try failed). */
export async function POST(req: Request, ctx: RouteContext<"/api/shops/[slug]/hero">) {
  const r = await requireShop(req, (await ctx.params).slug);
  if ("error" in r) return r.error;
  if (!geminiEnabled()) return NextResponse.json({ error: "Set GEMINI_API_KEY first." }, { status: 400 });
  await updateShop(r.shop.id, { hero_status: "pending" });
  after(() => generateHero(r.shop));
  return NextResponse.json({ ok: true });
}
