import { NextResponse } from "next/server";
import { allowlistedEmail, endAdminSession, startAdminSession } from "@/lib/admin";

/** Admin sign-in: {accessToken} from the Supabase password sign-in /admin/gallery does in the browser. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { accessToken?: string } | null;
  const email = await allowlistedEmail(String(body?.accessToken ?? ""));
  if (!email) return NextResponse.json({ error: "That account isn't allowed here." }, { status: 403 });
  await startAdminSession(email);
  return NextResponse.json({ email });
}

export async function DELETE() {
  await endAdminSession();
  return NextResponse.json({ ok: true });
}
