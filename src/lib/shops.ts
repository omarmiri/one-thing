import "server-only";
import { one, query } from "./db";
import { newId, tokensMatch } from "./ids";
import { DesignSpec } from "./design";

export type Shop = {
  id: string;
  slug: string;
  admin_token: string;
  status: "draft" | "live";
  seller_email: string | null;
  paypal_email: string | null;
  paypal_merchant_id: string | null;
  zapier_hook_url: string | null;
  description: string;
  product_type: "digital" | "physical";
  price_cents: number;
  currency: string;
  shipping_cents: number;
  ship_countries: string | null;
  stock: number | null;
  photo_blob: string | null;
  hero_blob: string | null;
  hero_status: "none" | "pending" | "ready" | "failed";
  digital_blob: string | null;
  spec: DesignSpec;
  ai_source: "gemini" | "fallback";
  created_at: string;
};

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
  created_at: string;
  paid_at: string | null;
};

// pg returns jsonb already parsed; PGlite does too. Re-validate anyway: specs from older
// schema versions shouldn't crash a live shop page.
function hydrate(row: Shop | null): Shop | null {
  if (!row) return null;
  const parsed = DesignSpec.safeParse(row.spec);
  return parsed.success ? { ...row, spec: parsed.data } : row;
}

export const getShopBySlug = async (slug: string) =>
  hydrate(await one<Shop>("SELECT * FROM shops WHERE slug = $1", [slug]));

/** Returns the shop only if the admin token is right. */
export async function getOwnedShop(slug: string, token: string | null | undefined) {
  const shop = await getShopBySlug(slug);
  return shop && tokensMatch(token, shop.admin_token) ? shop : null;
}

export async function updateShop(id: string, fields: Partial<Omit<Shop, "id">>) {
  const keys = Object.keys(fields);
  if (!keys.length) return;
  const sets = keys.map((k, i) => `${k} = $${i + 2}`).join(", ");
  const values = keys.map((k) => {
    const v = (fields as Record<string, unknown>)[k];
    return k === "spec" ? JSON.stringify(v) : v;
  });
  await query(`UPDATE shops SET ${sets}, updated_at = now() WHERE id = $1`, [id, ...values]);
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

export const getOrder = (id: string) => one<Order>("SELECT * FROM orders WHERE id = $1", [id]);

export const blobUrl = (id: string | null) => (id ? `/api/blobs/${id}` : null);

/** What the shop templates need, computed from the row. */
export function shopView(shop: Shop) {
  return {
    spec: shop.spec,
    priceLabel: money(shop.price_cents, shop.currency),
    shippingLabel:
      shop.product_type === "digital" ? null : shop.shipping_cents === 0 ? "free" : money(shop.shipping_cents, shop.currency),
    shipCountries: shop.product_type === "physical" ? shop.ship_countries : null,
    stock: shop.product_type === "physical" ? shop.stock : null,
    photoUrl: blobUrl(shop.photo_blob),
    heroUrl: blobUrl(shop.hero_blob),
  };
}

export const money =(cents: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
