import { NextResponse } from "next/server";
import { currentAccount } from "@/lib/accounts";
import { revokeKey } from "@/lib/apiKeys";

/** Revoke a key: calls with it get 401 from now on. Its shops stay with the account. */
export async function DELETE(_req: Request, ctx: RouteContext<"/api/account/keys/[id]">) {
  const account = await currentAccount();
  if (!account) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  if (account.session_via !== "paypal") {
    return NextResponse.json({ error: "API keys need a verified sign-in. Log in with PayPal, then try again." }, { status: 403 });
  }
  if (!(await revokeKey(account.id, (await ctx.params).id))) return NextResponse.json({ error: "No such key." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
