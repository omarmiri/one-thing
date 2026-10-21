import { NextResponse } from "next/server";
import { parseIdentifier, signIn, startSession } from "@/lib/accounts";

/** POST { identifier: email or phone } → signs in, creating the account the first time. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { identifier?: unknown } | null;
  const id = parseIdentifier(typeof body?.identifier === "string" ? body.identifier : "");
  if ("error" in id) return NextResponse.json({ error: id.error }, { status: 400 });
  const account = await signIn(id);
  await startSession(account.id);
  return NextResponse.json({ id: account.id, email: account.email, phone: account.phone });
}
