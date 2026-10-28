import { NextResponse } from "next/server";
import { parseIdentifier, signIn } from "@/lib/accounts";
import { isAdmin } from "@/lib/admin";
import { one } from "@/lib/db";

/**
 * Gives a shop nobody owns to an account, by its email or phone: for shops made before accounts
 * (or signed out) whose seller lost the private manage link. A plain form post from
 * /admin/gallery, then back there. Shops that already belong to an account are never moved.
 */
export async function POST(req: Request) {
  const f = await req.formData();
  const key = f.get("key");
  if (!(await isAdmin(key))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const id = parseIdentifier(String(f.get("owner") ?? "").trim());
  let note = "";
  if ("error" in id) note = id.error;
  else {
    // The account is created if it's new, as signing in would; the seller then signs in with it.
    const account = await signIn(id);
    const given = await one(
      `UPDATE shops SET account_id = $1, seller_email = COALESCE(seller_email, $3) WHERE id = $2 AND account_id IS NULL RETURNING id`,
      [account.id, String(f.get("id") ?? ""), "email" in id ? id.email : null],
    );
    note = given ? `Given to ${"email" in id ? id.email : id.phone}.` : "That shop already belongs to an account.";
  }
  // Relative Location: behind Render's proxy req.url is http://localhost:3000. Signed in, the key stays out of the URL.
  const back = new URLSearchParams({ note, ...(typeof key === "string" && key ? { key } : {}), ...(f.get("q") ? { q: String(f.get("q")) } : {}) });
  return new Response(null, { status: 303, headers: { Location: `/admin/gallery?${back}` } });
}
