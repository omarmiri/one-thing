import "server-only";
import { one, query } from "./db";
import { newId, tokensMatch } from "./ids";
import { DesignSpec } from "./design";
import type { Referral } from "./channel3";
import type { PayPalStatus } from "./paypal";
import type { Choice, OptionStock, ShopOption, Suggestions } from "./options";
import { Showcase, showcaseView } from "./showcase";

export type Shop = {
  id: string;
  slug: string;
  admin_token: string;
  status: "draft" | "live";
  seller_email: string | null;
  paypal_email: string | null;
  paypal_merchant_id: string | null;
  paypal_status: PayPalStatus | null;
  options: ShopOption[];
  option_stock: OptionStock;
  suggestions: Suggestions | null;
  zapier_hook_url: string | null;
  description: string;
  product_type: "digital" | "physical" | "referral";
  price_cents: number;
  currency: string;
  shipping_cents: number;
  ship_countries: string | null;
  stock: number | null;
  photo_blob: string | null;
  hero_blob: string | null;
  hero_status: "none" | "pending" | "ready" | "failed";
  hero_error: string | null;
  digital_blob: string | null;
  delivery: "file" | "access_code";
  access_url: string | null;
  referral: Referral | null;
  source_url: string | null;
  in_gallery: boolean; // the seller asked to be in the gallery
  gallery_status: GalleryStatus; // the site admin's answer (/admin/gallery)
  account_id: string | null;
  api_key_id: string | null; // made by a platform's API key: its seller isn't the account owner
  paypal_return_url: string | null; // where Connect PayPal sends the seller back (a platform's page)
  paypal_tracking_id: string | null; // the latest Connect PayPal attempt (null: older shops used id)
  showcase: Showcase | null;
  showcase_blobs: string[];
  gallery_blobs: string[];
  spec: DesignSpec;
  ai_source: "gemini" | "fallback";
  ai_model: string | null;
  design_b: DesignB | null;
  created_at: string;
};

/** The A/B test's other version of the design. */
export type DesignB = { spec: DesignSpec; model: string | null; seconds: number | null };

export type Order = {
  id: string;
  shop_id: string;
  paypal_order_id: string | null;
  status: "created" | "paid" | "failed";
  amount_cents: number;
  shipping_cents: number;
  currency: string;
  buyer_email: string | null;
  buyer_name: string | null;
  shipping_address: Record<string, string> | null;
  capture_id: string | null;
  fulfillment_status: "none" | "to_ship" | "shipped" | "digital_sent";
  carrier: string | null;
  tracking_number: string | null;
  tracking_synced: boolean;
  download_token: string | null;
  downloads: number;
  access_code: string | null;
  code_uses: number;
  code_last_used_at: string | null;
  channel: "web" | "agent";
  options: Choice | null;
  created_at: string;
  paid_at: string | null;
};

// pg returns jsonb already parsed; PGlite does too. Re-validate anyway: specs from older
// schema versions shouldn't crash a live shop page.
function hydrate(row: Shop | null): Shop | null {
  if (!row) return null;
  const parsed = DesignSpec.safeParse(row.spec);
  const showcase = row.showcase ? Showcase.safeParse(row.showcase) : null;
  return { ...(parsed.success ? { ...row, spec: parsed.data } : row), showcase: showcase?.success ? showcase.data : null };
}

/** By current or former link name. Compare shop.slug to what was asked for to redirect old links. */
export const getShopBySlug = async (slug: string) =>
  hydrate(
    await one<Shop>(
      `SELECT s.* FROM shops s
        WHERE s.slug = $1 OR s.id = (SELECT shop_id FROM shop_slugs WHERE slug = $1)
        LIMIT 1`,
      [slug],
    ),
  );

/** Returns the shop only if the admin token is right. */
export async function getOwnedShop(slug: string, token: string | null | undefined) {
  const shop = await getShopBySlug(slug);
  return shop && tokensMatch(token, shop.admin_token) ? shop : null;
}

// jsonb columns: written as JSON text (node-postgres would turn a JS array into a Postgres array).
const JSONB = new Set(["spec", "paypal_status", "options", "option_stock", "suggestions", "design_b"]);

// What the gallery review approved: changing any of these sends an approved shop back to review,
// so a harmless page can't be approved and then swapped for something else.
const REVIEWED_IMAGES = ["photo_blob", "gallery_blobs", "hero_blob", "showcase_blobs"];
const REVIEWED_TEXT = ["productName", "headline"]; // in spec

export async function updateShop(id: string, fields: Partial<Omit<Shop, "id">>) {
  const keys = Object.keys(fields);
  if (!keys.length) return;
  const sets = keys.map((k, i) => `${k} = $${i + 2}`);
  const values = keys.map((k) => {
    const v = (fields as Record<string, unknown>)[k];
    return JSONB.has(k) && v !== null ? JSON.stringify(v) : v;
  });
  // Compared against the old row (SET expressions see values from before the update).
  const changed = keys.flatMap((k, i) =>
    REVIEWED_IMAGES.includes(k)
      ? [`${k} IS DISTINCT FROM $${i + 2}`]
      : k === "spec"
        ? REVIEWED_TEXT.map((f) => `spec->>'${f}' IS DISTINCT FROM $${i + 2}::jsonb->>'${f}'`)
        : [],
  );
  if (changed.length && !keys.includes("gallery_status")) {
    sets.push(`gallery_status = CASE WHEN gallery_status = 'approved' AND (${changed.join(" OR ")}) THEN 'pending' ELSE gallery_status END`);
  }
  await query(`UPDATE shops SET ${sets.join(", ")}, updated_at = now() WHERE id = $1`, [id, ...values]);
}

/**
 * A shop's connected PayPal account; the seller's other shops that have none get it too. Not for
 * a platform's shops (api_key_id): each belongs to a different seller, so nothing is shared.
 */
export async function saveConnection(shop: Pick<Shop, "id" | "account_id" | "api_key_id">, merchantId: string, status: PayPalStatus) {
  await updateShop(shop.id, { paypal_merchant_id: merchantId, paypal_status: status });
  if (shop.account_id && !shop.api_key_id) {
    await query(
      "UPDATE shops SET paypal_merchant_id = $2, paypal_status = $3, updated_at = now() WHERE account_id = $1 AND api_key_id IS NULL AND paypal_merchant_id IS NULL",
      [shop.account_id, merchantId, JSON.stringify(status)],
    );
  }
}

export async function saveBlob(data: Uint8Array, mime: string, filename?: string) {
  const id = newId();
  await query("INSERT INTO blobs (id, mime, filename, data) VALUES ($1, $2, $3, $4)", [
    id, mime, filename ?? null, data,
  ]);
  return id;
}

export const getBlob = (id: string) =>
  one<{ id: string; mime: string; filename: string | null; data: Uint8Array }>(
    "SELECT * FROM blobs WHERE id = $1",
    [id],
  );

export const listOrders = (shopId: string) =>
  query<Order>("SELECT * FROM orders WHERE shop_id = $1 ORDER BY created_at DESC", [shopId]);

export type WebhookEvent = {
  id: string;
  event_type: string;
  paypal_order_id: string | null;
  summary: string | null;
  verified: boolean;
  outcome: string;
  received_at: string;
};

export const listWebhookEvents = (shopId: string) =>
  query<WebhookEvent>(
    `SELECT id, event_type, paypal_order_id, summary, verified, outcome, received_at
       FROM webhook_events WHERE shop_id = $1 ORDER BY received_at DESC LIMIT 50`,
    [shopId],
  );

export const getOrder =(id: string) => one<Order>("SELECT * FROM orders WHERE id = $1", [id]);

/** Live shops whose sellers opted into the public gallery, newest first. */
export type GalleryStatus = "pending" | "approved" | "rejected";

export const listLiveShops = async (limit = 60) =>
  (
    await query<Shop>(
      "SELECT * FROM shops WHERE status = 'live' AND in_gallery AND gallery_status = 'approved' ORDER BY created_at DESC LIMIT $1",
      [limit],
    )
  ).map((row) => hydrate(row)!);

/** Shops that asked to be in the gallery, for review: waiting ones first, then newest. */
export const listGalleryRequests = async () =>
  (
    await query<Shop>(
      "SELECT * FROM shops WHERE in_gallery ORDER BY gallery_status = 'pending' DESC, created_at DESC LIMIT 200",
    )
  ).map((row) => hydrate(row)!);

export const setGalleryStatus = (id: string, status: GalleryStatus) => updateShop(id, { gallery_status: status });

export const blobUrl = (id: string | null) => (id ? `/api/blobs/${id}` : null);

/** The product photos, cover first. */
export const shopPhotos = (shop: Pick<Shop, "photo_blob" | "gallery_blobs">) =>
  [shop.photo_blob, ...(shop.gallery_blobs ?? [])].filter((b): b is string => Boolean(b));

/** The colour option's photos as gallery positions: { option: "Color", index: { Red: 0, Blue: 2 } }. */
function colorPhotos(shop: Shop) {
  const colour = shop.product_type === "physical" ? (shop.options ?? []).find((o) => o.kind === "color") : undefined;
  if (!colour) return null;
  const photos = shopPhotos(shop);
  const index = Object.fromEntries(
    colour.values.flatMap((v) => (v.photo && photos.includes(v.photo) ? [[v.label, photos.indexOf(v.photo)]] : [])),
  );
  return Object.keys(index).length ? { option: colour.name, index } : null;
}

/** What the shop templates need, computed from the row. */
export function shopView(shop: Shop) {
  return {
    spec: shop.spec,
    priceLabel: money(shop.price_cents, shop.currency),
    // Digital products show how they're delivered instead of a shipping cost.
    digitalLabel: shop.delivery === "access_code" ? "Instant access" : "Instant download",
    shippingLabel:
      shop.product_type !== "physical" ? null : shop.shipping_cents === 0 ? "free" : money(shop.shipping_cents, shop.currency),
    referral: shop.product_type === "referral" ? shop.referral : null,
    shipCountries: shop.product_type === "physical" ? shop.ship_countries : null,
    stock: shop.product_type === "physical" ? shop.stock : null,
    // Buyer options (physical products only): the picker, and stock per combination.
    slug: shop.slug,
    options: shop.product_type === "physical" ? (shop.options ?? []) : [],
    optionStock: shop.option_stock ?? {},
    // Picking a colour slides the gallery to that colour's photo.
    colorPhotos: colorPhotos(shop),
    photoUrl: blobUrl(shop.photo_blob),
    // Every product photo, cover first: what the gallery and Inspect page through.
    photos: shopPhotos(shop).map((b) => blobUrl(b)!),
    heroUrl: blobUrl(shop.hero_blob),
    showcase: shop.product_type !== "referral" && shop.showcase ? showcaseView(shop.showcase, (b) => blobUrl(b)!) : null,
  };
}

export const money =(cents: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);

/** The seller's app link with the buyer's access code filled in, so "Start now" unlocks it. */
export function withCode(url: string, code: string) {
  const u = new URL(url);
  u.searchParams.set("code", code);
  return u.toString();
}

/** An account's shops, newest first. */
export const listAccountShops = async (accountId: string) =>
  (await query<Shop>("SELECT * FROM shops WHERE account_id = $1 ORDER BY created_at DESC", [accountId])).map((row) => hydrate(row)!);
