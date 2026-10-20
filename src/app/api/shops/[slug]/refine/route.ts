import { NextResponse } from "next/server";
import { requireShop } from "@/lib/auth";
import { refineShop } from "@/lib/gemini";
import { updateShop } from "@/lib/shops";

export const maxDuration = 60;

/** "Make it warmer" → Gemini edits the design spec. */
export async function POST(req: Request, ctx: RouteContext<"/api/shops/[slug]/refine">) {
  const r = await requireShop(req, (await ctx.params).slug);
  if ("error" in r) return r.error;
  const body = (await req.json().catch(() => null)) as { instruction?: string } | null;
  const instruction = body?.instruction?.trim();
  if (!instruction || instruction.length > 500) {
    return NextResponse.json({ error: "Say what to change, in a sentence." }, { status: 400 });
  }
  try {
    const spec = await refineShop(r.shop.spec, instruction);
    await updateShop(r.shop.id, { spec });
    return NextResponse.json({ spec });
  } catch (err) {
    console.error("refine failed:", err);
    return NextResponse.json({ error: (err as Error).message || "The AI designer hit a snag." }, { status: 502 });
  }
}
