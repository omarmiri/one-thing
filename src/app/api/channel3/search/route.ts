import { NextResponse } from "next/server";
import { Channel3Error, channel3Enabled, searchProducts, toReferral } from "@/lib/channel3";

/** "Find a product" in onboarding: GET ?q=trail running gifts under $60 → product cards. */
export async function GET(req: Request) {
  if (!channel3Enabled()) return NextResponse.json({ error: "Product search isn't set up (CHANNEL3_API_KEY)." }, { status: 503 });
  const q = new URL(req.url).searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json({ products: [] });
  try {
    const products = await searchProducts(q.slice(0, 200));
    return NextResponse.json({
      products: products
        .map((p) => {
          const r = toReferral(p);
          const best = r.offers[0];
          return best && r.image
            ? {
                id: p.id,
                title: p.title,
                brand: r.brand,
                image: r.image,
                price: best.price,
                currency: best.currency,
                retailer: best.domain,
                retailers: r.offers.length,
                commission: Math.max(...r.offers.map((o) => o.commission)),
              }
            : null;
        })
        .filter(Boolean),
    });
  } catch (err) {
    console.error(err);
    const out = err instanceof Channel3Error && err.status === 402 ? "Product search is out of credits." : "Product search failed. Try again.";
    return NextResponse.json({ error: out }, { status: 502 });
  }
}
