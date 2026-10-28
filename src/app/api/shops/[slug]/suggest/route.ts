import { NextResponse } from "next/server";
import { requireShop } from "@/lib/auth";
import { geminiEnabled, listingText, suggestOptions } from "@/lib/gemini";
import { limited } from "@/lib/rateLimit";
import { getBlob, updateShop } from "@/lib/shops";

/** Check for missing details: asks Gemini again about an existing shop's options and gaps. */
export async function POST(req: Request, ctx: RouteContext<"/api/shops/[slug]/suggest">) {
  const r = await requireShop(req, (await ctx.params).slug);
  if ("error" in r) return r.error;
  const busy = await limited("ai", req.headers);
  if (busy) return busy;
  const { shop } = r;
  if (!geminiEnabled()) return NextResponse.json({ error: "Set GEMINI_API_KEY first." }, { status: 400 });
  if (shop.product_type === "referral") return NextResponse.json({ error: "Recommendations use the retailer's details." }, { status: 400 });
  const blob = shop.photo_blob ? await getBlob(shop.photo_blob) : null;
  const suggestions = await suggestOptions(
    listingText(shop.spec, [
      shop.product_type === "physical" ? `Stock: ${shop.stock ?? "unlimited"}` : `Delivery: ${shop.delivery === "access_code" ? `access code, used at ${shop.access_url ?? "the seller's site"}` : "file download"}`,
      shop.options.length ? `Buyer options already set: ${shop.options.map((o) => `${o.name}: ${o.values.map((v) => v.label).join(", ")}`).join("; ")}` : "",
    ]),
    blob ? { data: blob.data, mime: blob.mime } : undefined,
  );
  if (!suggestions) return NextResponse.json({ error: "The AI couldn't check just now. Try again." }, { status: 502 });
  await updateShop(shop.id, { suggestions });
  return NextResponse.json(suggestions);
}
