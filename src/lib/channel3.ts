import "server-only";

// Sponsor tool: Channel3 — 100M+ products from 25k+ retailers, with tracked buy links that earn
// commission. Used two ways in onboarding: "find a product" (search) and "paste a link" (lookup:
// if the page is a product Channel3 knows, the seller can recommend it and earn on referrals).
//
// Every catalog request carries x-user-id = the shop id, so Channel3 attributes clicks and
// commissions on the returned buy links to that shop (see PLAN.md section 8B for payouts).

const API = "https://api.trychannel3.com/v1";

export const channel3Enabled = () => Boolean(process.env.CHANNEL3_API_KEY);

export type C3Offer = {
  url: string;
  domain: string;
  price: { price?: number; amount?: number; compare_at_price?: number | null; currency: string };
  availability?: string;
  condition?: string | null;
  max_commission_rate?: number;
};
export type C3Product = {
  id: string;
  title: string;
  description?: string | null;
  brands?: { id: string; name: string }[];
  images?: { url: string; cleaned_url?: string | null; is_main_image?: boolean; alt_text?: string | null }[];
  category?: { title?: string; path?: string[] | string } | null;
  materials?: string[] | null;
  key_features?: string[] | null;
  offers?: C3Offer[];
};

/** What a referral shop keeps: enough to render the page without calling Channel3 again. */
export type Referral = {
  productId: string;
  title: string;
  brand: string | null;
  image: string | null;
  offers: { domain: string; url: string; price: number; currency: string; inStock: boolean; commission: number }[];
};

async function call<T>(path: string, init: { method?: string; body?: unknown; userId?: string }): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: init.method ?? "GET",
    headers: {
      "x-api-key": process.env.CHANNEL3_API_KEY ?? "",
      "content-type": "application/json",
      ...(init.userId && { "x-user-id": init.userId }),
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Channel3Error(res.status, await res.text());
  return (await res.json()) as T;
}

export class Channel3Error extends Error {
  constructor(public status: number, public body: string) {
    super(`Channel3 ${status}: ${body.slice(0, 300)}`);
  }
}

export const searchProducts = (query: string, userId?: string) =>
  call<{ products: C3Product[] }>("/search", { method: "POST", body: { query, limit: 12 }, userId }).then(
    (r) => r.products ?? [],
  );

export const getProduct = (id: string, userId?: string) =>
  call<C3Product>(`/products/${encodeURIComponent(id)}`, { userId });

/** null when the page isn't a product Channel3 can read (404 / 422): not a retailer listing. */
export async function lookupUrl(url: string, userId?: string): Promise<C3Product | null> {
  try {
    const r = await call<{ product?: C3Product } & Partial<C3Product>>("/lookup", { method: "POST", body: { url }, userId });
    return r.product ?? (r.id ? (r as C3Product) : null);
  } catch (err) {
    if (err instanceof Channel3Error && [404, 422, 500].includes(err.status)) return null;
    throw err;
  }
}

const offerPrice = (o: C3Offer) => o.price?.price ?? o.price?.amount ?? 0;
export const mainImage = (p: C3Product) => {
  const img = p.images?.find((i) => i.is_main_image) ?? p.images?.[0];
  return img ? (img.cleaned_url ?? img.url) : null;
};

export function toReferral(p: C3Product): Referral {
  const offers = (p.offers ?? [])
    .map((o) => ({
      domain: o.domain,
      url: o.url,
      price: offerPrice(o),
      currency: o.price?.currency ?? "USD",
      inStock: o.availability !== "OutOfStock",
      commission: o.max_commission_rate ?? 0,
    }))
    .filter((o) => o.url && o.price > 0)
    .sort((a, b) => Number(b.inStock) - Number(a.inStock) || a.price - b.price)
    .slice(0, 4);
  return { productId: p.id, title: p.title, brand: p.brands?.[0]?.name ?? null, image: mainImage(p), offers };
}

/** Plain-text summary for Gemini to design from. */
export function describeProduct(p: C3Product): string {
  const r = toReferral(p);
  return [
    `Product: ${p.title}${r.brand ? ` by ${r.brand}` : ""}`,
    p.category?.path ? `Category: ${Array.isArray(p.category.path) ? p.category.path.join(" > ") : p.category.path}` : "",
    p.description ? `Description: ${p.description.slice(0, 1500)}` : "",
    p.key_features?.length ? `Key features: ${p.key_features.slice(0, 8).join("; ")}` : "",
    p.materials?.length ? `Materials: ${p.materials.join(", ")}` : "",
    r.offers.length ? `Sold at: ${r.offers.map((o) => `${o.domain} ${o.price} ${o.currency}`).join(", ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
