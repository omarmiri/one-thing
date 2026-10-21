import "server-only";
import { cookies } from "next/headers";
import { one, query } from "./db";
import { newId } from "./ids";
import type { PayPalIdentity } from "./paypal";

// Seller accounts, as simple as they can be: type an email or a phone number and you're in.
// The first time creates the account; after that it signs you back in. There's no password and
// no verification yet, so anyone who knows an identifier can use that account. Fine for the
// sandbox; add a one-time code (email link or SMS) before real money depends on it.

export type Account = {
  id: string;
  email: string | null;
  phone: string | null;
  paypal_user_id: string | null;
  paypal_email: string | null; // where sales are paid: filled in by Log in with PayPal
  paypal_payer_id: string | null;
  created_at: string;
};

const COOKIE = "ot_session";
const YEAR = 60 * 60 * 24 * 365;

/** What a person typed, as an email or a phone number, or why it's neither. */
export function parseIdentifier(input: string): { email: string } | { phone: string } | { error: string } {
  const raw = input.trim();
  if (raw.includes("@")) {
    const email = raw.toLowerCase();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254 ? { email } : { error: "That email doesn't look right." };
  }
  // Phone numbers: keep a leading + and the digits; spaces, dashes and brackets are just formatting.
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length >= 7 && digits.length <= 15 && /^\+?[\d\s().-]+$/.test(raw)) return { phone: (raw.startsWith("+") ? "+" : "") + digits };
  return { error: "Enter an email address or a phone number." };
}

/** The account for this identifier, created if it's new. Shops it already owns by email come along. */
export async function signIn(id: { email: string } | { phone: string }): Promise<Account> {
  const [col, value] = "email" in id ? (["email", id.email] as const) : (["phone", id.phone] as const);
  // Insert-or-select in one statement, so two tabs signing up at once get the same account.
  await query(`INSERT INTO accounts (id, ${col}) VALUES ($1, $2) ON CONFLICT (${col}) DO NOTHING`, [newId(9), value]);
  const account = (await one<Account>(`SELECT * FROM accounts WHERE ${col} = $1`, [value]))!;
  await claimShops(account);
  return account;
}

/** Shops made before accounts, whose seller gave this email, join the account. */
async function claimShops(account: Account) {
  if (account.email) {
    await query("UPDATE shops SET account_id = $1 WHERE account_id IS NULL AND lower(seller_email) = $2", [account.id, account.email]);
  }
}

/**
 * Log in with PayPal. The account is the one this PayPal account signed into before; else the
 * signed-in one (connecting PayPal from Your shops); else the one with the same email; else new.
 * Its PayPal email becomes where sales are paid, on every shop that doesn't have one yet.
 */
export async function signInWithPayPal(pp: PayPalIdentity, signedIn: Account | null): Promise<Account> {
  let account =
    (await one<Account>("SELECT * FROM accounts WHERE paypal_user_id = $1", [pp.userId])) ??
    signedIn ??
    (pp.email ? await one<Account>("SELECT * FROM accounts WHERE email = $1", [pp.email]) : null);
  if (!account) {
    const id = newId(9);
    // A PayPal email someone already typed belongs to that account (the lookup above); new otherwise.
    await query("INSERT INTO accounts (id, email) VALUES ($1, $2)", [id, pp.email]);
    account = (await one<Account>("SELECT * FROM accounts WHERE id = $1", [id]))!;
  }
  await query(
    `UPDATE accounts SET paypal_user_id = $2, paypal_email = COALESCE($3, paypal_email), paypal_payer_id = COALESCE($4, paypal_payer_id),
       email = COALESCE(email, (SELECT $3::text WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE email = $3)))
     WHERE id = $1`,
    [account.id, pp.userId, pp.email, pp.payerId],
  );
  account = (await one<Account>("SELECT * FROM accounts WHERE id = $1", [account.id]))!;
  await claimShops(account);
  if (account.paypal_email) {
    await query("UPDATE shops SET paypal_email = $2 WHERE account_id = $1 AND paypal_email IS NULL", [account.id, account.paypal_email]);
  }
  return account;
}

export async function startSession(accountId: string) {
  const token = newId(24);
  await query("INSERT INTO sessions (token, account_id) VALUES ($1, $2)", [token, accountId]);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: YEAR,
  });
}

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await query("DELETE FROM sessions WHERE token = $1", [token]);
  jar.delete(COOKIE);
}

/** The signed-in account, or null. */
export async function currentAccount(): Promise<Account | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  return one<Account>("SELECT a.* FROM sessions s JOIN accounts a ON a.id = s.account_id WHERE s.token = $1", [token]);
}

export const accountLabel = (a: Account) => a.email ?? a.phone ?? "your account";
