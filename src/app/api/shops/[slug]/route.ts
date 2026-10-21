import { NextResponse } from "next/server";
import { z } from "zod";
import { requireShop } from "@/lib/auth";
import { paypalConnectEnabled, paypalReadyToPay } from "@/lib/paypal";
import { allSoldOut, combos, comboKey, MAX_COMBOS, ShopOption } from "@/lib/options";
import { shopPhotos, updateShop, type Shop } from "@/lib/shops";
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
  in_gallery: z.boolean().optional(),
  // Buyer options (physical only), stock per combination (null = unlimited), and answers to the
  // "buyers will ask" questions, which become product details.
  options: z.array(ShopOption).max(3).optional(),
  option_stock: z.record(z.string().max(100), z.number().int().min(0).nullable()).optional(),
  facts: z.array(z.object({ label: z.string().trim().min(1).max(30), value: z.string().trim().min(1).max(100) })).max(5).optional(),
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
  // Going live with PayPal checkout needs somewhere for the money to go: a connected PayPal
  // account PayPal says can be paid, or (the fallback) a typed PayPal email.
  if (s.status === "live" && kind !== "referral" && paypalConnectEnabled()) {
    const email = s.paypal_email !== undefined ? s.paypal_email : shop.paypal_email;
    if (!paypalReadyToPay(shop) && !email) {
      const st = shop.paypal_status;
      const error = !shop.paypal_merchant_id
        ? "Connect PayPal (or enter a PayPal email) so your sales have somewhere to go."
        : !st?.emailConfirmed
          ? "Confirm your email at PayPal first, then Check again."
          : "PayPal says your account can't receive payments yet. Finish setting it up at PayPal, then Check again.";
      return NextResponse.json({ error, field: "paypal" }, { status: 400 });
    }
  }
  let optionFields: Partial<Shop> = {};
  if (s.options !== undefined) {
    // A colour's photo must be one of this shop's photos.
    const mine = new Set(shopPhotos(shop));
    const options = (kind === "physical" ? s.options : []).map((o) => ({
      ...o,
      values: o.values.map(({ photo, ...v }) => (photo && mine.has(photo) ? { ...v, photo } : v)),
    }));
    if (new Set(options.map((o) => o.name.toLowerCase())).size !== options.length) {
      return NextResponse.json({ error: "Each option needs its own name." }, { status: 400 });
    }
    if (options.some((o) => new Set(o.values.map((v) => v.label.toLowerCase())).size !== o.values.length)) {
      return NextResponse.json({ error: "An option has the same value twice." }, { status: 400 });
    }
    if (combos(options).length > MAX_COMBOS) {
      return NextResponse.json({ error: `That's more than ${MAX_COMBOS} combinations. Trim some sizes or colors.` }, { status: 400 });
    }
    // Keep stock only for combinations that still exist.
    const given = s.option_stock ?? shop.option_stock ?? {};
    const option_stock = Object.fromEntries(
      combos(options).map((c) => comboKey(options, c)).filter((k) => typeof given[k] === "number").map((k) => [k, given[k]]),
    );
    // With options, stock is counted per combination instead of for the whole shop.
    optionFields = { options, option_stock, ...(options.length && { stock: null }) };
  }
  if (s.status === "live" && kind === "physical") {
    const options = optionFields.options ?? shop.options ?? [];
    if (options.length && allSoldOut(options, optionFields.option_stock ?? shop.option_stock ?? {})) {
      return NextResponse.json({ error: "Every combination has 0 in stock. Add stock before going live." }, { status: 400 });
    }
  }
  // Answered questions become product details (replacing a detail with the same label).
  let specFields: Partial<Shop> = {};
  if (s.facts?.length) {
    const labels = new Set(s.facts.map((f) => f.label.toLowerCase()));
    const details = [...shop.spec.details.filter((d) => !labels.has(d.label.toLowerCase())), ...s.facts].slice(-8);
    const asked = shop.suggestions;
    specFields = {
      spec: { ...shop.spec, details },
      ...(asked && { suggestions: { ...asked, missingFacts: asked.missingFacts.filter((m) => !labels.has(m.label.toLowerCase())) } }),
    };
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
    ...(s.in_gallery !== undefined && { in_gallery: s.in_gallery }),
    ...optionFields,
    ...specFields,
  });
  return NextResponse.json({ ok: true, slug: slug ?? shop.slug });
}
