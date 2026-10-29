import "server-only";
import { one, query } from "./db";

// Shop links are one path segment: onething.app/raptorrush. Sellers pick them; every name a
// shop has ever had stays in shop_slugs, so old links (and apps that verify codes by name)
// keep working after a rename.

// Top-level routes, and names worth keeping for ourselves.
const RESERVED = new Set([
  "new", "manage", "api", "s", "admin", "login", "logout", "signup", "account", "settings",
  "dashboard", "help", "about", "pricing", "terms", "privacy", "blog", "docs", "shop", "shops",
  "app", "www", "static", "assets", "public", "favicon.ico", "robots.txt", "sitemap.xml",
  "onething", "one-thing", "paypal", "checkout", "thanks", "download", "_next", "gallery", "mcp", "llms",
]);

export const SLUG_RULES = "3–30 characters: lowercase letters, numbers and dashes";

/** "Raptor Rush!" → "raptor-rush". Empty when nothing usable is left. */
export function toSlug(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30)
    .replace(/-$/, "");
}

/** Why a slug can't be used (format or reserved), or null. Doesn't check whether it's taken. */
export function slugProblem(slug: string): string | null {
  if (!/^[a-z0-9](?:[a-z0-9-]{1,28})[a-z0-9]$/.test(slug) || slug.includes("--")) return `Use ${SLUG_RULES}.`;
  if (RESERVED.has(slug)) return "That name is reserved. Try another.";
  return null;
}

/** Taken by any shop, now or in the past (old names keep redirecting). */
export async function slugTaken(slug: string, exceptShopId?: string): Promise<boolean> {
  const row = await one<{ shop_id: string }>("SELECT shop_id FROM shop_slugs WHERE slug = $1", [slug]);
  return Boolean(row && row.shop_id !== exceptShopId);
}

/** The seller's choice if it's valid and free; otherwise derived from the product name. */
export async function pickSlug(wanted: string | null, productName: string): Promise<{ slug: string } | { error: string }> {
  if (wanted) {
    const slug = toSlug(wanted);
    const problem = slugProblem(slug);
    if (problem) return { error: problem };
    if (await slugTaken(slug)) return { error: `onething/${slug} is taken. Try another name.` };
    return { slug };
  }
  let base = toSlug(productName).slice(0, 26).replace(/-$/, "");
  if (slugProblem(base)) base = `shop-${base}`.slice(0, 26).replace(/-$/, "");
  if (slugProblem(base)) base = "shop";
  for (let n = 1; n < 50; n++) {
    const slug = n === 1 ? base : `${base}-${n}`;
    if (!slugProblem(slug) && !(await slugTaken(slug))) return { slug };
  }
  return { slug: `${base}-${Date.now().toString(36)}` };
}

export const claimSlug = (slug: string, shopId: string) =>
  query("INSERT INTO shop_slugs (slug, shop_id) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING", [slug, shopId]);
