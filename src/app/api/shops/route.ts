import { after, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { designShop, geminiEnabled } from "@/lib/gemini";
import { generateHero } from "@/lib/hero";
import { newId } from "@/lib/ids";
import { claimSlug, pickSlug, slugProblem, slugTaken, toSlug } from "@/lib/slugs";
import { saveBlob } from "@/lib/shops";

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
const email = (v: string | null) => (v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? v : null);

/** Create a draft shop: photo + sentence → Gemini design → draft. Hero art follows in the background. */
export async function POST(req: Request) {
  const form = await req.formData();
  const description = str(form, "description");
  if (!description || description.length < 10) {
    return NextResponse.json({ error: "Tell us a bit about the product (at least a sentence)." }, { status: 400 });
  }
  const typeIn = str(form, "type");
  const type = typeIn === "digital" || typeIn === "physical" ? typeIn : "auto";

  const photo = file(form, "photo");
  if (photo && (!photo.type.startsWith("image/") || photo.size > 8 * MB)) {
    return NextResponse.json({ error: "Photo must be an image under 8 MB." }, { status: 400 });
  }
  const digital = file(form, "digital_file");
  if (digital && digital.size > 25 * MB) {
    return NextResponse.json({ error: "Digital files are limited to 25 MB for now." }, { status: 400 });
  }
  const delivery = str(form, "delivery") === "access_code" ? "access_code" : "file";
  const accessUrl = str(form, "access_url");
  if (accessUrl && !/^https:\/\/\S+$/.test(accessUrl)) {
    return NextResponse.json({ error: "The app link must start with https://" }, { status: 400 });
  }
  const paypalEmail = str(form, "paypal_email");
  if (paypalEmail && !email(paypalEmail)) {
    return NextResponse.json({ error: "That PayPal email doesn't look right." }, { status: 400 });
  }

  // Check a chosen link name before spending a Gemini call on the design.
  const wantedSlug = str(form, "slug");
  if (wantedSlug) {
    const s = toSlug(wantedSlug);
    const problem = slugProblem(s) ?? ((await slugTaken(s)) ? `That link is taken. Try another name.` : null);
    if (problem) return NextResponse.json({ error: problem, field: "slug" }, { status: 400 });
  }

  const photoBytes = photo ? new Uint8Array(await photo.arrayBuffer()) : null;
  let design;
  try {
    design = await designShop({
      description,
      type,
      photo: photoBytes && photo ? { data: photoBytes, mime: photo.type } : undefined,
    });
  } catch (err) {
    console.error("Gemini design failed:", err);
    return NextResponse.json({ error: "The AI designer hit a snag. Please try again." }, { status: 502 });
  }
  const { spec, source } = design;
  // A digital shop without its file is fine as a draft; publishing requires it.
  const productType = spec.productType;

  const id = newId();
  const picked = await pickSlug(wantedSlug, spec.productName);
  if ("error" in picked) return NextResponse.json({ error: picked.error, field: "slug" }, { status: 409 });
  const slug = picked.slug;
  const adminToken = newId(24);
  const photoBlob = photoBytes && photo ? await saveBlob(photoBytes, photo.type, photo.name) : null;
  const digitalBlob = digital
    ? await saveBlob(new Uint8Array(await digital.arrayBuffer()), digital.type || "application/octet-stream", digital.name)
    : null;
  const stock = str(form, "stock");
  const heroPending = geminiEnabled() && Boolean(spec.heroPrompt);

  await query(
    `INSERT INTO shops (id, slug, admin_token, seller_email, paypal_email, zapier_hook_url, description,
       product_type, price_cents, shipping_cents, ship_countries, stock, photo_blob, digital_blob,
       hero_status, spec, ai_source, delivery, access_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)`,
    [
      id, slug, adminToken, email(str(form, "seller_email")), paypalEmail, str(form, "zapier_hook_url"),
      description, productType,
      cents(str(form, "price")) ?? Math.round(spec.suggestedPriceUsd * 100),
      productType === "digital" ? 0 : (cents(str(form, "shipping")) ?? Math.round(spec.suggestedShippingUsd * 100)),
      productType === "physical" ? (str(form, "ship_countries")?.toUpperCase() ?? "US") : null,
      productType === "physical" && stock && Number.isInteger(Number(stock)) ? Number(stock) : null,
      photoBlob, digitalBlob, heroPending ? "pending" : "none", JSON.stringify(spec), source,
      productType === "digital" ? delivery : "file", productType === "digital" ? accessUrl : null,
    ],
  );

  await claimSlug(slug, id);

  if (heroPending) after(() => generateHero({ id, spec, photo_blob: photoBlob }));

  return NextResponse.json({ slug, token: adminToken, manageUrl: `/manage/${slug}?token=${adminToken}` });
}
