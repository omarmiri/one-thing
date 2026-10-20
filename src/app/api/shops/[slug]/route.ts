import { NextResponse } from "next/server";
import { z } from "zod";
import { requireShop } from "@/lib/auth";
import { updateShop } from "@/lib/shops";
import { claimSlug, slugProblem, slugTaken, toSlug } from "@/lib/slugs";

/** Polled by the manage page while hero art is generating. */
export async function GET(req: Request, ctx: RouteContext<"/api/shops/[slug]">) {
  const r = await requireShop(req, (await ctx.params).slug);
  if ("error" in r) return r.error;
  const { admin_token: _t, ...shop } = r.shop;
  return NextResponse.json(shop);
}

const Settings = z.object({
  price: z.number().min(0.5).max(10000).optional(),
  shipping: z.number().min(0).max(500).optional(),
  stock: z.number().int().min(0).nullable().optional(),
  ship_countries: z.string().max(200).nullable().optional(),
  paypal_email: z.email().nullable().optional(),
  seller_email: z.email().nullable().optional(),
  zapier_hook_url: z.url().startsWith("https://").nullable().optional(),
  status: z.enum(["draft", "live"]).optional(),
  delivery: z.enum(["file", "access_code"]).optional(),
  access_url: z.url().startsWith("https://").nullable().optional(),
  slug: z.string().max(60).optional(),
  product_type: z.enum(["physical", "digital", "referral"]).optional(),
});

export async function PATCH(req: Request, ctx: RouteContext<"/api/shops/[slug]">) {
  const r = await requireShop(req, (await ctx.params).slug);
  if ("error" in r) return r.error;
  const { shop } = r;
  const parsed = Settings.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const s = parsed.data;

  const kind = s.product_type ?? shop.product_type;
  if (kind === "referral" && !shop.referral?.offers.length) {
    return NextResponse.json({ error: "Only products found through Channel3 can be recommendations." }, { status: 400 });
  }
  if (s.status === "live" && kind === "digital") {
    const delivery = s.delivery ?? shop.delivery;
    if (delivery === "file" && !shop.digital_blob) {
      return NextResponse.json({ error: "Upload the file buyers will download before publishing." }, { status: 400 });
    }
    if (delivery === "access_code" && !(s.access_url ?? shop.access_url)) {
      return NextResponse.json({ error: "Add the link where buyers use their access code before publishing." }, { status: 400 });
    }
  }
  // Renaming the link: the old name keeps redirecting (shop_slugs).
  let slug: string | undefined;
  if (s.slug !== undefined && toSlug(s.slug) !== shop.slug) {
    slug = toSlug(s.slug);
    const problem = slugProblem(slug) ?? ((await slugTaken(slug, shop.id)) ? "That link is taken. Try another name." : null);
    if (problem) return NextResponse.json({ error: problem, field: "slug" }, { status: 400 });
    await claimSlug(slug, shop.id);
  }
  await updateShop(shop.id, {
    ...(slug && { slug }),
    ...(s.price !== undefined && { price_cents: Math.round(s.price * 100) }),
    ...(s.product_type && { product_type: s.product_type }),
    ...(s.shipping !== undefined && kind === "physical" && { shipping_cents: Math.round(s.shipping * 100) }),
    ...(s.stock !== undefined && { stock: s.stock }),
    ...(s.ship_countries !== undefined && { ship_countries: s.ship_countries?.toUpperCase() ?? null }),
    ...(s.paypal_email !== undefined && { paypal_email: s.paypal_email }),
    ...(s.seller_email !== undefined && { seller_email: s.seller_email }),
    ...(s.zapier_hook_url !== undefined && { zapier_hook_url: s.zapier_hook_url }),
    ...(s.status && { status: s.status }),
    ...(s.delivery && kind === "digital" && { delivery: s.delivery }),
    ...(s.access_url !== undefined && { access_url: s.access_url }),
  });
  return NextResponse.json({ ok: true, slug: slug ?? shop.slug });
}
