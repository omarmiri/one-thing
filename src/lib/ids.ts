import "server-only";
import { randomBytes, timingSafeEqual } from "node:crypto";

export const newId = (bytes = 12) => randomBytes(bytes).toString("base64url");

// No 0/O, 1/I/L, U: codes get read aloud and typed on phones.
const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";

/** "K7QF-M2XP-9HTD": 12 characters from a 30-letter alphabet, about 59 bits. */
export function accessCode(): string {
  const bytes = randomBytes(12);
  const chars = [...bytes].map((b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
  return `${chars.slice(0, 4)}-${chars.slice(4, 8)}-${chars.slice(8)}`;
}

/** Accepts what people type: lower case, spaces, missing dashes. */
export function normalizeCode(input: string): string | null {
  const raw = input.toUpperCase().replace(/[^0-9A-Z]/g, "");
  return raw.length === 12 ? `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8)}` : null;
}

export function tokensMatch(given: string | null | undefined, expected: string): boolean {
  if (!given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Public origin for absolute links (share URLs, PayPal return URLs, og:image). Render sets
// RENDER_EXTERNAL_URL on every web service, so an unset APP_URL there still gets the real host.
export const appUrl = () =>
  (process.env.APP_URL || process.env.RENDER_EXTERNAL_URL || "http://localhost:3000").replace(/\/$/, "");
