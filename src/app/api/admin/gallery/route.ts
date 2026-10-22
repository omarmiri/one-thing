import { NextResponse } from "next/server";
import { isAdminKey } from "@/lib/ids";
import { setGalleryStatus } from "@/lib/shops";

/** Approve or reject a gallery request: a plain form post from /admin/gallery, then back there. */
export async function POST(req: Request) {
  const f = await req.formData();
  const key = String(f.get("key") ?? "");
  if (!isAdminKey(key)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const status = f.get("status");
  if (status !== "approved" && status !== "rejected" && status !== "pending") {
    return NextResponse.json({ error: "Bad status" }, { status: 400 });
  }
  await setGalleryStatus(String(f.get("id") ?? ""), status);
  return NextResponse.redirect(new URL(`/admin/gallery?key=${encodeURIComponent(key)}`, req.url), 303);
}
