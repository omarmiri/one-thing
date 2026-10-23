import { NextResponse } from "next/server";
import { isAiFetcher, isBot, recordVisit } from "@/lib/stats";

/**
 * The shop page's visit beacon: one per page load, sent by the browser once the page is up, so
 * crawlers that don't run JavaScript never count. Public; it only ever adds to a counter.
 */
export async function POST(req: Request, ctx: RouteContext<"/api/shops/[slug]/visit">) {
  const h = req.headers;
  if (!isBot(h) && !isAiFetcher(h)) {
    const body = (await req.json().catch(() => null)) as { ref?: string } | null;
    await recordVisit({ slug: (await ctx.params).slug }, h, "web", typeof body?.ref === "string" ? body.ref : null);
  }
  return new NextResponse(null, { status: 204 });
}
