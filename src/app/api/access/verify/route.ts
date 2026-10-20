import { NextResponse } from "next/server";
import { one } from "@/lib/db";
import { normalizeCode } from "@/lib/ids";

// Called from the seller's own app or game (another origin), e.g. Raptor Rush on
// miriogames.com, to check a buyer's access code before unlocking. It only ever answers
// valid / not valid for one shop, so any origin may ask.
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type",
  "access-control-max-age": "86400",
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

/** { shop: "<slug>", code: "K7QF-M2XP-9HTD" } → { valid, product? } */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { shop?: string; code?: string } | null;
  const code = typeof body?.code === "string" ? normalizeCode(body.code) : null;
  if (!body?.shop || !code) return NextResponse.json({ valid: false }, { headers: CORS });

  const row = await one<{ product: string }>(
    `UPDATE orders o SET code_uses = code_uses + 1, code_last_used_at = now()
       FROM shops s
      WHERE o.shop_id = s.id AND s.id = (SELECT shop_id FROM shop_slugs WHERE slug = $1)
        AND o.access_code = $2 AND o.status = 'paid'
      RETURNING s.spec->>'productName' AS product`,
    [body.shop, code],
  );
  return NextResponse.json(row ? { valid: true, product: row.product } : { valid: false }, { headers: CORS });
}
