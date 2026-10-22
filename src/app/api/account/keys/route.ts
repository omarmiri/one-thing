import { NextResponse } from "next/server";
import { z } from "zod";
import { currentAccount } from "@/lib/accounts";
import { createKey, listKeys, toOrigin } from "@/lib/apiKeys";

const Body = z.object({
  name: z.string().trim().min(1).max(40),
  returnOrigins: z.array(z.string().max(200)).max(5).default([]),
});

/** Who may manage keys: a signed-in account whose session came through Log in with PayPal. */
async function keyOwner() {
  const account = await currentAccount();
  if (!account) return { error: NextResponse.json({ error: "Sign in first." }, { status: 401 }) };
  if (account.session_via !== "paypal") {
    return { error: NextResponse.json({ error: "API keys need a verified sign-in. Log in with PayPal, then try again." }, { status: 403 }) };
  }
  return { account };
}

export async function GET() {
  const r = await keyOwner();
  if ("error" in r) return r.error;
  return NextResponse.json({ keys: await listKeys(r.account.id) });
}

/** A new key. The full key is in this reply only. */
export async function POST(req: Request) {
  const r = await keyOwner();
  if ("error" in r) return r.error;
  const body = Body.safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Give the key a name (up to 40 characters)." }, { status: 400 });
  const origins = body.data.returnOrigins.map((o) => o.trim()).filter(Boolean);
  const parsed = origins.map(toOrigin);
  const bad = origins.find((_, i) => !parsed[i]);
  if (bad) return NextResponse.json({ error: `"${bad}" isn't an https address.`, field: "returnOrigins" }, { status: 400 });
  const { id, key } = await createKey(r.account.id, body.data.name, [...new Set(parsed as string[])]);
  return NextResponse.json({ id, key });
}
