import "server-only";
import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { query } from "./db";

// Per-IP caps on the calls that cost something: a checkout is a PayPal order, a new shop or a
// seller's AI tool is a Gemini call on our paid key. Fixed windows counted in Postgres, so they
// hold across restarts and instances. Generous on purpose: assistants fetch for many buyers from
// a few shared addresses, and a cap here should only ever stop a loop or a flood.
const LIMITS = {
  order: { max: 30, minutes: 10, what: "checkouts" },
  shop: { max: 10, minutes: 60, what: "new shops" },
  ai: { max: 60, minutes: 60, what: "AI requests" },
} as const;

export type LimitKind = keyof typeof LIMITS;

// Cloudflare's header first: it overwrites whatever the client sent, where X-Forwarded-For's
// first entry is whatever the client said. Local dev has neither, and isn't limited.
const clientIp = (h: Headers) => h.get("cf-connecting-ip") || h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "";

/** Counts one call. Null while under the cap, else what to tell the caller and when to retry. */
export async function overLimit(kind: LimitKind, h: Headers): Promise<{ error: string; retryAfter: number } | null> {
  const ip = clientIp(h);
  if (!ip) return null;
  const { max, minutes, what } = LIMITS[kind];
  const windowMs = minutes * 60_000;
  const win = Math.floor(Date.now() / windowMs);
  // The salt keeps the stored keys from being tested against known IPs, as in stats.ts.
  const key = createHash("sha256").update(`${process.env.ADMIN_KEY ?? ""}|${kind}|${ip}`).digest("hex").slice(0, 24);
  try {
    const [row] = await query<{ hits: number }>(
      `INSERT INTO rate_hits (key, win) VALUES ($1, $2)
       ON CONFLICT (key, win) DO UPDATE SET hits = rate_hits.hits + 1 RETURNING hits`,
      [key, win],
    );
    if (Math.random() < 0.01) await query("DELETE FROM rate_hits WHERE at < now() - interval '1 day'");
    if (row.hits <= max) return null;
  } catch (err) {
    // A counting hiccup must not stop a sale.
    console.error("rate limit:", err);
    return null;
  }
  const retryAfter = Math.ceil(((win + 1) * windowMs - Date.now()) / 1000);
  return { error: `Too many ${what} from your network. Try again in ${Math.ceil(retryAfter / 60)} min.`, retryAfter };
}

/** overLimit as a ready 429 for a route, or null to carry on. */
export async function limited(kind: LimitKind, h: Headers) {
  const over = await overLimit(kind, h);
  return over && NextResponse.json({ error: over.error }, { status: 429, headers: { "retry-after": String(over.retryAfter), "cache-control": "no-store" } });
}
