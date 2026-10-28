import { NextResponse } from "next/server";
import sharp from "sharp";
import { z } from "zod";
import { requireShop } from "@/lib/auth";
import { geminiEnabled, matchColorPhotos } from "@/lib/gemini";
import { limited } from "@/lib/rateLimit";
import { getBlob, shopPhotos } from "@/lib/shops";

const Body = z.object({ colors: z.array(z.object({ label: z.string().max(30), hex: z.string().max(7).optional() })).min(1).max(12) });

/**
 * Match photos to colours: which of the shop's photos shows each colour. Suggests only; the
 * seller saves the result with the rest of the setup panel. Body: the colours as currently edited.
 */
export async function POST(req: Request, ctx: RouteContext<"/api/shops/[slug]/match-photos">) {
  const r = await requireShop(req, (await ctx.params).slug);
  if ("error" in r) return r.error;
  const busy = await limited("ai", req.headers);
  if (busy) return busy;
  if (!geminiEnabled()) return NextResponse.json({ error: "Set GEMINI_API_KEY first." }, { status: 400 });
  const body = Body.safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Send the colours to match." }, { status: 400 });
  const ids = shopPhotos(r.shop);
  if (ids.length < 2) return NextResponse.json({ error: "Add a photo of each colour first." }, { status: 400 });

  // Small JPEGs: enough to tell colours apart, and cheap to send.
  const photos = await Promise.all(
    ids.map(async (id) => {
      const blob = await getBlob(id);
      const data = await sharp(blob!.data).rotate().resize(384, 384, { fit: "inside" }).jpeg({ quality: 70 }).toBuffer();
      return { data: new Uint8Array(data), mime: "image/jpeg" };
    }),
  );
  try {
    const byIndex = await matchColorPhotos(body.data.colors, photos);
    return NextResponse.json({ matches: Object.fromEntries(Object.entries(byIndex).map(([label, i]) => [label, ids[i]])) });
  } catch (err) {
    console.error("match photos:", err);
    return NextResponse.json({ error: "The AI couldn't match them just now. Try again." }, { status: 502 });
  }
}
