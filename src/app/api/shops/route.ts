import { after, NextResponse } from "next/server";
import { channel3Enabled, describeProduct, getProduct, lookupUrl, mainImage, toReferral, type C3Product } from "@/lib/channel3";
import { query } from "@/lib/db";
import { fetchImage, fetchPage } from "@/lib/fetchPage";
import { designShop, geminiEnabled, type Photo } from "@/lib/gemini";
import { generateHero } from "@/lib/hero";
import { newId } from "@/lib/ids";
import { saveBlob } from "@/lib/shops";
import { claimSlug, pickSlug, slugProblem, slugTaken, toSlug } from "@/lib/slugs";

export const maxDuration = 60;

const MB = 1024 * 1024;
const str = (f: FormData, k: string) => {
  const v = f.get(k);
  return typeof v === "string" && v.trim() ? v.trim() : null;
};
const cents = (v: string | null) => (v && !Number.isNaN(Number(v)) ? Math.round(Number(v) * 100) : null);
const file = (f: FormData, k: string) => {
  const v = f.get(k);
  return v instanceof File && v.size > 0 ? v : null;
};
const fail = (error: string, status = 400, field?: string) => NextResponse.json({ error, ...(field && { field }) }, { status });

/**
 * Onboarding, step 1. One of three starts:
 *   source=photo    a photo and/or a sentence about the seller's own product
 *   source=link     a link: a Channel3-known retailer product (guess: recommend it, earn referrals)
 *                   or any other page, e.g. the seller's own game (guess: sell it with PayPal)
 *   source=channel3 a product picked from Channel3 search (a recommendation)
 * Gemini then guesses the rest (kind, delivery, price, link name, design) and we save a draft.
 * The seller checks those guesses on the manage page and goes live.
 */
export async function POST(req: Request) {
  const form = await req.formData();
  const source = str(form, "source") ?? "photo";
  const id = newId();
  let description = str(form, "description");

  // A chosen link name is checked before spending a Gemini call.
  const wantedSlug = str(form, "slug");
  if (wantedSlug) {
    const s = toSlug(wantedSlug);
    const problem = slugProblem(s) ?? ((await slugTaken(s)) ? "That link is taken. Try another name." : null);
    if (problem) return fail(problem, 400, "slug");
  }

  let photo: (Photo & { name?: string }) | null = null;
  let context: string | null = null;
  let product: C3Product | null = null;
  let sourceUrl: string | null = null;

  if (source === "photo") {
    const f = file(form, "photo");
    if (f && (!f.type.startsWith("image/") || f.size > 8 * MB)) return fail("Photo must be an image under 8 MB.");
    if (f) photo = { data: new Uint8Array(await f.arrayBuffer()), mime: f.type, name: f.name };
    if (!photo && (!description || description.length < 10)) return fail("Add a photo, or tell us about the product in a sentence.");
  } else if (source === "link") {
    sourceUrl = str(form, "url");
    if (!sourceUrl || !/^https?:\/\/\S+\.\S+/.test(sourceUrl)) return fail("Paste a full link, starting with https://", 400, "url");
    if (channel3Enabled()) product = await lookupUrl(sourceUrl, id).catch(() => null);
    if (product) {
      context = describeProduct(product);
    } else {
      try {
        const page = await fetchPage(sourceUrl);
        context = [`Page: ${sourceUrl}`, page.title && `Title: ${page.title}`, page.description && `Summary: ${page.description}`, `Text: ${page.text}`]
          .filter(Boolean)
          .join("\n");
        if (page.image) photo = page.image;
      } catch (err) {
        return fail(`We couldn't read that page: ${(err as Error).message}`, 400, "url");
      }
    }
  } else if (source === "channel3") {
    const productId = str(form, "productId");
    if (!productId || !channel3Enabled()) return fail("Pick a product first.");
    product = await getProduct(productId, id).catch(() => null);
    if (!product) return fail("That product isn't available anymore. Pick another.");
    context = describeProduct(product);
  } else {
    return fail("Unknown start.");
  }

  // A recommendation earns through Channel3; a product of your own sells through PayPal.
  const referral = product ? toReferral(product) : null;
  const isReferral =
    Boolean(referral?.offers.length) && (source === "channel3" || (referral?.offers.some((o) => o.commission > 0) ?? false));
  if (product && !photo) {
    const img = mainImage(product);
    if (img) photo = await fetchImage(img);
  }

  const typeIn = str(form, "type");
  let design;
  try {
    design = await designShop({
      type: isReferral ? "physical" : typeIn === "digital" || typeIn === "physical" ? typeIn : "auto",
      description,
      photo: photo ?? undefined,
      context,
      referral: isReferral,
    });
  } catch (err) {
    console.error("Gemini design failed:", err);
    return fail("The AI designer hit a snag. Please try again.", 502);
  }
  const { spec: generated, source: aiSource } = design;
  const { suggestedLink, digitalDelivery, ...spec } = generated;
  description ??= [spec.productName, spec.subheadline].join(". ");

  // The link: the seller's choice, else Gemini's suggestion if it's free, else from the name.
  let slug: string;
  const picked = await pickSlug(wantedSlug, spec.productName);
  if ("error" in picked) return fail(picked.error, 409, "slug");
  slug = picked.slug;
  if (!wantedSlug) {
    const guess = toSlug(suggestedLink ?? "");
    if (guess && !slugProblem(guess) && !(await slugTaken(guess))) slug = guess;
  }

  const productType = isReferral ? "referral" : spec.productType;
  const digital = file(form, "digital_file");
  if (digital && digital.size > 25 * MB) return fail("Digital files are limited to 25 MB for now.");
  const accessUrl = str(form, "access_url");
  const delivery =
    productType !== "digital" ? "file" : (str(form, "delivery") ?? digitalDelivery) === "access_code" ? "access_code" : "file";
  const lowest = referral?.offers.length ? Math.min(...referral.offers.map((o) => o.price)) : null;
  const price = isReferral && lowest ? Math.round(lowest * 100) : (cents(str(form, "price")) ?? Math.round(spec.suggestedPriceUsd * 100));

  const adminToken = newId(24);
  const photoBlob = photo ? await saveBlob(photo.data, photo.mime, photo.name) : null;
  const digitalBlob = digital
    ? await saveBlob(new Uint8Array(await digital.arrayBuffer()), digital.type || "application/octet-stream", digital.name)
    : null;
  const heroPending = geminiEnabled() && Boolean(spec.heroPrompt) && !isReferral;
  const stock = str(form, "stock");

  await query(
    `INSERT INTO shops (id, slug, admin_token, seller_email, paypal_email, description, product_type, price_cents,
       shipping_cents, ship_countries, stock, photo_blob, digital_blob, hero_status, spec, ai_source, delivery,
       access_url, referral, source_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)`,
    [
      id, slug, adminToken, str(form, "seller_email"), str(form, "paypal_email"), description, productType, price,
      productType === "physical" ? (cents(str(form, "shipping")) ?? Math.round(spec.suggestedShippingUsd * 100)) : 0,
      productType === "physical" ? (str(form, "ship_countries")?.toUpperCase() ?? "US") : null,
      productType === "physical" && stock && Number.isInteger(Number(stock)) ? Number(stock) : null,
      photoBlob, digitalBlob, heroPending ? "pending" : "none", JSON.stringify(spec), aiSource, delivery,
      // A pasted game/app page is the best first guess for where codes get used.
      delivery === "access_code" ? (accessUrl ?? sourceUrl) : null,
      referral ? JSON.stringify(referral) : null,
      sourceUrl,
    ],
  );
  await claimSlug(slug, id);

  if (heroPending) after(() => generateHero({ id, spec, photo_blob: photoBlob }));

  return NextResponse.json({ slug, token: adminToken, manageUrl: `/manage/${slug}?token=${adminToken}` });
}
