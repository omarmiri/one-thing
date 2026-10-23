import { NextResponse } from "next/server";
import { requireShop } from "@/lib/auth";
import { designShop, designerReady, type Designer } from "@/lib/gemini";
import { isAdminKey } from "@/lib/ids";
import { getBlob, updateShop, type DesignB } from "@/lib/shops";

export const maxDuration = 90;

/**
 * Design A/B test, for the site's own testing: open the manage page with &ab=<ADMIN_KEY>.
 *   {action: "make", designer}: design the shop again with that model, from the seller's same
 *     words and photo, and keep it as version B. The live design doesn't change.
 *   {action: "swap"}: version B becomes the design, and the current one becomes B.
 * Hero art stays as it is: it was made for the first design's hero prompt.
 */
export async function POST(req: Request, ctx: RouteContext<"/api/shops/[slug]/ab">) {
  const r = await requireShop(req, (await ctx.params).slug);
  if ("error" in r) return r.error;
  if (!isAdminKey(req.headers.get("x-ab-key"))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const shop = r.shop;
  const body = (await req.json().catch(() => null)) as { action?: string; designer?: Designer } | null;

  if (body?.action === "swap") {
    if (!shop.design_b) return NextResponse.json({ error: "Make a version B first." }, { status: 400 });
    const b: DesignB = { spec: shop.spec, model: shop.ai_model, seconds: null };
    await updateShop(shop.id, { spec: shop.design_b.spec, ai_model: shop.design_b.model, design_b: b });
    return NextResponse.json({ model: shop.design_b.model, b: { model: b.model, seconds: b.seconds } });
  }

  const designer = body?.designer;
  if (body?.action !== "make" || (designer !== "gemini" && designer !== "qwen")) {
    return NextResponse.json({ error: "Say make (with a designer) or swap." }, { status: 400 });
  }
  if (!designerReady(designer)) return NextResponse.json({ error: `The ${designer} designer isn't configured here.` }, { status: 400 });
  const photo = shop.photo_blob ? await getBlob(shop.photo_blob) : null;
  const referral = shop.product_type === "referral";
  const t0 = Date.now();
  try {
    const { spec: generated, model } = await designShop({
      type: shop.product_type === "referral" ? "physical" : shop.product_type,
      description: shop.description,
      photo: photo ? { data: photo.data, mime: photo.mime } : undefined,
      // The pasted page's text isn't kept, so B sees only the seller's words and photo.
      referral,
      designer,
    });
    const { suggestedLink: _l, digitalDelivery: _d, ...spec } = generated;
    const b: DesignB = { spec: { ...spec, productType: shop.spec.productType }, model, seconds: Math.round((Date.now() - t0) / 100) / 10 };
    await updateShop(shop.id, { design_b: b });
    return NextResponse.json({ b: { model: b.model, seconds: b.seconds } });
  } catch (err) {
    console.error("A/B design failed:", err);
    const detail = String((err as Error).message ?? err).replace(/\s+/g, " ").slice(0, 300);
    return NextResponse.json({ error: `${designer} couldn't design it: ${detail}` }, { status: 502 });
  }
}
