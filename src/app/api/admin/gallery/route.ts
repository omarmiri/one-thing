import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { setGalleryStatus } from "@/lib/shops";

/** Approve or reject a gallery request: a plain form post from /admin/gallery, then back there. */
export async function POST(req: Request) {
  const f = await req.formData();
  const key = f.get("key");
  if (!(await isAdmin(key))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const status = f.get("status");
  if (status !== "approved" && status !== "rejected" && status !== "pending") {
    return NextResponse.json({ error: "Bad status" }, { status: 400 });
  }
  await setGalleryStatus(String(f.get("id") ?? ""), status);
  // A relative Location: behind Render's proxy req.url is http://localhost:3000, not the public host.
  // Signed in, the key stays out of the URL.
  const back = typeof key === "string" && key ? `/admin/gallery?key=${encodeURIComponent(key)}` : "/admin/gallery";
  return new Response(null, { status: 303, headers: { Location: back } });
}
