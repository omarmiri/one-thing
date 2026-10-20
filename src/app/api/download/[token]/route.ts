import { one } from "@/lib/db";
import { getBlob } from "@/lib/shops";

const MAX_DOWNLOADS = 5;
const VALID_DAYS = 14;

/** A paid digital order's private download link. Limited uses and lifetime. */
export async function GET(_req: Request, ctx: RouteContext<"/api/download/[token]">) {
  const { token } = await ctx.params;
  const row = await one<{ digital_blob: string | null }>(
    `UPDATE orders o SET downloads = downloads + 1
       FROM shops s
      WHERE o.shop_id = s.id AND o.download_token = $1 AND o.status = 'paid'
        AND o.downloads < $2 AND o.paid_at > now() - ($3 || ' days')::interval
      RETURNING s.digital_blob`,
    [token, MAX_DOWNLOADS, String(VALID_DAYS)],
  );
  const blob = row?.digital_blob ? await getBlob(row.digital_blob) : null;
  if (!blob) {
    return new Response("This download link has expired or was used too many times. Contact the seller for a new one.", {
      status: 410,
    });
  }
  const name = (blob.filename ?? "download").replace(/["\\\r\n]/g, "");
  return new Response(Buffer.from(blob.data), {
    headers: {
      "content-type": blob.mime,
      "content-disposition": `attachment; filename="${name}"`,
      "cache-control": "private, no-store",
    },
  });
}
