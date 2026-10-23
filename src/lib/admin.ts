import "server-only";
import { createHmac } from "node:crypto";
import { cookies } from "next/headers";
import { isAdminKey, tokensMatch } from "./ids";

// Site admin (gallery review): signed in with the Opal Games usage dashboard's Supabase account,
// or the ADMIN_KEY link as before. That Supabase project's auth is shared with other apps, so
// being signed in isn't enough: the email must be in its analytics_allowlist, which the
// is_analytics_viewer() function checks for the caller's token.

const COOKIE = "onething_admin";
const WEEK = 7 * 24 * 60 * 60;

/** The Supabase project to sign in with; its URL and anon key are public (the dashboards ship them). */
export function adminSupabase(): { url: string; anonKey: string } | null {
  const url = process.env.ADMIN_SUPABASE_URL?.replace(/\/$/, "");
  const anonKey = process.env.ADMIN_SUPABASE_ANON_KEY;
  return url && anonKey && process.env.ADMIN_KEY ? { url, anonKey } : null;
}

/** The email behind a Supabase access token, if it's allowlisted; else null. */
export async function allowlistedEmail(accessToken: string): Promise<string | null> {
  const sb = adminSupabase();
  if (!sb || !accessToken) return null;
  const headers = { apikey: sb.anonKey, authorization: `Bearer ${accessToken}`, "content-type": "application/json" };
  const [allowed, user] = await Promise.all([
    fetch(`${sb.url}/rest/v1/rpc/is_analytics_viewer`, { method: "POST", headers, body: "{}" }),
    fetch(`${sb.url}/auth/v1/user`, { headers }),
  ]);
  if (!allowed.ok || !user.ok || (await allowed.json()) !== true) return null;
  const { email } = (await user.json()) as { email?: string };
  return email ?? null;
}

// The cookie is "<email>.<expiry>.<signature>", signed with ADMIN_KEY: changing the key signs everyone out.
const sign = (payload: string) => createHmac("sha256", process.env.ADMIN_KEY!).update(payload).digest("base64url");

export async function startAdminSession(email: string) {
  const payload = `${Buffer.from(email).toString("base64url")}.${Math.floor(Date.now() / 1000) + WEEK}`;
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: WEEK,
  });
}

export async function endAdminSession() {
  (await cookies()).delete(COOKIE);
}

/** The signed-in admin's email, or null. */
export async function currentAdmin(): Promise<string | null> {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value || !process.env.ADMIN_KEY) return null;
  const [email, exp, sig] = value.split(".");
  if (!email || !exp || !tokensMatch(sig, sign(`${email}.${exp}`)) || Number(exp) * 1000 < Date.now()) return null;
  return Buffer.from(email, "base64url").toString();
}

/** A signed-in admin, or the ADMIN_KEY link. */
export async function isAdmin(key?: unknown) {
  return (typeof key === "string" && isAdminKey(key)) || Boolean(await currentAdmin());
}
