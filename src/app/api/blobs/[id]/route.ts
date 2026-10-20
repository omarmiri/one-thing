import { one } from "@/lib/db";
import { getBlob } from "@/lib/shops";

/** Public images only. Digital products are never served here — see /api/download/[token]. */
export async function GET(_req: Request, ctx: RouteContext<"/api/blobs/[id]">) {
  const { id } = await ctx.params;
  const isImage = await one("SELECT 1 FROM shops WHERE photo_blob = $1 OR hero_blob = $1 LIMIT 1", [id]);
  const blob = isImage ? await getBlob(id) : null;
  if (!blob) return new Response("Not found", { status: 404 });
  return new Response(Buffer.from(blob.data), {
    headers: { "content-type": blob.mime, "cache-control": "public, max-age=31536000, immutable" },
  });
}
