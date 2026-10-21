import { NextResponse } from "next/server";
import { z } from "zod";
import { requireShop } from "@/lib/auth";
import { shopPhotos, updateShop } from "@/lib/shops";

const Body = z.object({ photos: z.record(z.string().max(30), z.string().max(40).nullable()) });

/**
 * Sets which photo shows each colour, and nothing else, so matching photos (or picking one by hand)
 * saves at once without also saving other unsaved edits in the panel. Body: { photos: { label: id | null } }.
 * Only colours already saved on the shop are changed; the reply lists them.
 */
export async function PUT(req: Request, ctx: RouteContext<"/api/shops/[slug]/color-photos">) {
  const r = await requireShop(req, (await ctx.params).slug);
  if ("error" in r) return r.error;
  const body = Body.safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Send the photo for each colour." }, { status: 400 });
  const { shop } = r;
  const mine = new Set(shopPhotos(shop));
  const saved: string[] = [];
  const options = (shop.options ?? []).map((o) =>
    o.kind !== "color"
      ? o
      : {
          ...o,
          values: o.values.map(({ photo, ...v }) => {
            if (!(v.label in body.data.photos)) return photo ? { ...v, photo } : v;
            saved.push(v.label);
            const next = body.data.photos[v.label];
            return next && mine.has(next) ? { ...v, photo: next } : v;
          }),
        },
  );
  if (saved.length) await updateShop(shop.id, { options });
  return NextResponse.json({ saved });
}
