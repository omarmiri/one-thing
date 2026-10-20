import "server-only";
import { randomBytes, timingSafeEqual } from "node:crypto";

export const newId = (bytes = 12) => randomBytes(bytes).toString("base64url");

/** "Hand-thrown Mug — Ocean Blue!" → "hand-thrown-mug-ocean-blue-x7k2" */
export function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .slice(0, 40)
    .replace(/-+$/, "");
  return `${base || "shop"}-${randomBytes(3).toString("hex").slice(0, 4)}`;
}

export function tokensMatch(given: string | null | undefined, expected: string): boolean {
  if (!given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const appUrl = () => (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
