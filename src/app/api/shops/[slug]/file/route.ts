import { NextResponse } from "next/server";
import { requireShop } from "@/lib/auth";
import { saveBlob, updateShop } from "@/lib/shops";

/** Upload (or replace) the file a digital product's buyers download. */
export async function POST(req: Request, ctx: RouteContext<"/api/shops/[slug]/file">) {
  const r = await requireShop(req, (await ctx.params).slug);
  if ("error" in r) return r.error;
  const f = (await req.formData()).get("file");
  if (!(f instanceof File) || f.size === 0) return NextResponse.json({ error: "Choose a file." }, { status: 400 });
  if (f.size > 25 * 1024 * 1024) return NextResponse.json({ error: "Files are limited to 25 MB for now." }, { status: 400 });
  const blob = await saveBlob(new Uint8Array(await f.arrayBuffer()), f.type || "application/octet-stream", f.name);
  await updateShop(r.shop.id, { digital_blob: blob });
  return NextResponse.json({ ok: true, filename: f.name });
}
