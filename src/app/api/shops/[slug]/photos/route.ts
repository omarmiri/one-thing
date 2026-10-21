import { NextResponse } from "next/server";
import sharp from "sharp";
import { z } from "zod";
import { requireShop } from "@/lib/auth";
import { query } from "@/lib/db";
import { blobUrl, saveBlob, shopPhotos, updateShop, type Shop } from "@/lib/shops";

// The product photos a seller adds while refining their shop. The cover (shops.photo_blob) is
// the photo the shop was made from; extra photos follow it in shops.gallery_blobs. Buyers swipe
// through them in a gallery and look closer in Inspect.

const MAX_PHOTOS = 8;
const MB = 1024 * 1024;

const view = (ids: string[]) => ({ photos: ids.map((id) => ({ id, url: blobUrl(id)! })) });

async function save(shop: Shop, ids: string[]) {
  await updateShop(shop.id, { photo_blob: ids[0] ?? null, gallery_blobs: ids.slice(1) });
}

/** Add photos (form field "photo", one or more). Each is turned upright, resized and stored as WebP. */
export async function POST(req: Request, ctx: RouteContext<"/api/shops/[slug]/photos">) {
  const r = await requireShop(req, (await ctx.params).slug);
  if ("error" in r) return r.error;
  if (r.shop.product_type === "referral") return NextResponse.json({ error: "Recommendations use the retailer's photos." }, { status: 400 });
  const files = (await req.formData()).getAll("photo").filter((f): f is File => f instanceof File && f.size > 0);
  if (!files.length) return NextResponse.json({ error: "Choose a photo." }, { status: 400 });

  const ids = shopPhotos(r.shop);
  if (ids.length + files.length > MAX_PHOTOS) {
    return NextResponse.json({ error: `A shop can have up to ${MAX_PHOTOS} photos.` }, { status: 400 });
  }
  for (const f of files) {
    if (!f.type.startsWith("image/") || f.size > 15 * MB) {
      return NextResponse.json({ error: `${f.name} isn't an image under 15 MB.` }, { status: 400 });
    }
    try {
      // rotate() applies the camera's orientation, so phone photos aren't sideways.
      const data = await sharp(Buffer.from(await f.arrayBuffer()))
        .rotate()
        .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 85 })
        .toBuffer();
      ids.push(await saveBlob(new Uint8Array(data), "image/webp", f.name));
    } catch {
      return NextResponse.json({ error: `We couldn't read ${f.name}.` }, { status: 400 });
    }
  }
  await save(r.shop, ids);
  return NextResponse.json(view(ids));
}

const Order = z.object({ photos: z.array(z.string()).max(MAX_PHOTOS) });

/** Set the order (the first is the cover). Leaving a photo out removes it. */
export async function PUT(req: Request, ctx: RouteContext<"/api/shops/[slug]/photos">) {
  const r = await requireShop(req, (await ctx.params).slug);
  if ("error" in r) return r.error;
  const parsed = Order.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Send { photos: [ids] }." }, { status: 400 });
  const current = shopPhotos(r.shop);
  const next = [...new Set(parsed.data.photos)];
  if (next.some((id) => !current.includes(id))) return NextResponse.json({ error: "That isn't one of this shop's photos." }, { status: 400 });

  await save(r.shop, next);
  const removed = current.filter((id) => !next.includes(id));
  if (removed.length) await query("DELETE FROM blobs WHERE id = ANY($1)", [removed]);
  return NextResponse.json(view(next));
}
