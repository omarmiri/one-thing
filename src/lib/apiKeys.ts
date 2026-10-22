import "server-only";
import { createHash } from "node:crypto";
import { one, query } from "./db";
import { newId } from "./ids";

// Platform API keys: a marketplace's server makes and manages shops for its sellers with one key
// (Authorization: Bearer ot_sk_…) instead of keeping each shop's admin token. A key reaches the
// shops of the account that made it, nothing else. Only a SHA-256 of the key is stored: it is
// shown once, and a database leak doesn't hand out working keys. Keys are made and revoked on
// /account/keys by a PayPal-verified session (see the api_keys schema in db.ts).

export type ApiKey = {
  id: string;
  account_id: string;
  name: string;
  prefix: string;
  return_origins: string[];
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
};

const PREFIX = "ot_sk_";
const hash = (key: string) => createHash("sha256").update(key).digest("hex");

/** An https origin ("https://www.example.com"), or null if it isn't one. */
export function toOrigin(input: string): string | null {
  try {
    const u = new URL(input.trim());
    return u.protocol === "https:" || u.hostname === "localhost" ? u.origin : null;
  } catch {
    return null;
  }
}

/** A new key. The full key is in the result only; it can't be read back later. */
export async function createKey(accountId: string, name: string, returnOrigins: string[]) {
  const key = PREFIX + newId(32);
  const id = newId(9);
  await query(
    "INSERT INTO api_keys (id, account_id, name, key_hash, prefix, return_origins) VALUES ($1, $2, $3, $4, $5, $6)",
    [id, accountId, name, hash(key), key.slice(0, 12), returnOrigins],
  );
  return { id, key };
}

export const listKeys = (accountId: string) =>
  query<ApiKey>(
    "SELECT id, account_id, name, prefix, return_origins, created_at, last_used_at, revoked_at FROM api_keys WHERE account_id = $1 ORDER BY created_at DESC",
    [accountId],
  );

export async function revokeKey(accountId: string, id: string) {
  const rows = await query("UPDATE api_keys SET revoked_at = now() WHERE id = $1 AND account_id = $2 AND revoked_at IS NULL RETURNING id", [id, accountId]);
  return rows.length > 0;
}

/**
 * The request's key: { key } when valid, { invalid: true } when a Bearer key was sent but is
 * wrong or revoked (the caller answers 401), null when none was sent.
 */
export async function requestKey(req: Request): Promise<{ key: ApiKey } | { invalid: true } | null> {
  const auth = req.headers.get("authorization");
  if (!auth?.toLowerCase().startsWith("bearer ")) return null;
  const given = auth.slice(7).trim();
  if (!given.startsWith(PREFIX)) return { invalid: true };
  const key = await one<ApiKey>(
    "UPDATE api_keys SET last_used_at = now() WHERE key_hash = $1 AND revoked_at IS NULL RETURNING id, account_id, name, prefix, return_origins, created_at, last_used_at, revoked_at",
    [hash(given)],
  );
  return key ? { key } : { invalid: true };
}
