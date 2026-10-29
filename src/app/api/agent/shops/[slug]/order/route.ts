import { NextResponse } from "next/server";
import { agentCreateOrder, AgentError, liveShop } from "@/lib/agent";
import { limited } from "@/lib/rateLimit";
import { agentName, isPersonClick, isPrefetcher, recordVisit } from "@/lib/stats";

/**
 * Orders one unit with a GET: create_order for AI assistants that can only fetch URLs. The
 * buyer's pick comes as query parameters (?Size=9). Like create_order, nothing is charged: the
 * reply's pay_url is where the buyer pays at PayPal, and status_url says when they have.
 *
 * A GET that creates something gets opened by crawlers and link previewers too. The ones we know
 * are told no here (and kept out by robots.txt); any other leaves an unpaid order at most: stock
 * is only taken when a payment is captured, and PayPal drops unapproved orders.
 */
// One line per order link in the host's logs (Render → Logs): which agent, what it got, how long it
// took. The app logs nothing else per request, and without this an assistant's "timed out" was a guess.
export async function GET(req: Request, ctx: RouteContext<"/api/agent/shops/[slug]/order">) {
  const started = Date.now();
  const res = await order(req, ctx);
  const ua = (req.headers.get("user-agent") ?? "").slice(0, 120);
  console.info(`order link ${new URL(req.url).pathname} ${res.status} ${Date.now() - started}ms ua="${ua}"`);
  return res;
}

async function order(req: Request, ctx: RouteContext<"/api/agent/shops/[slug]/order">) {
  const headers = { "cache-control": "no-store", "x-robots-tag": "noindex, nofollow" };
  if (isPrefetcher(req.headers)) {
    return NextResponse.json({ error: "Crawlers and link previews don't place orders. Read the product at the shop's page." }, { status: 403, headers });
  }
  const busy = await limited("order", req.headers);
  if (busy) return busy;
  try {
    const shop = await liveShop((await ctx.params).slug);
    const params = new URL(req.url).searchParams;
    // ?agent=<name>: optional, an agent naming itself for the seller's stats. Not an option pick.
    const agent = params.get("agent");
    await recordVisit(shop, req.headers, "agent", agent);
    // Names and values are matched without caring about case: ?size=m works for Size "M".
    const options = shop.product_type === "physical" ? (shop.options ?? []) : [];
    const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();
    const choice: Record<string, string> = {};
    for (const o of options) {
      const given = [...params].find(([k]) => same(k, o.name))?.[1];
      const value = given === undefined ? undefined : o.values.find((v) => same(v.label, given))?.label;
      if (!value) {
        const allowed = o.values.map((v) => v.label).join(", ");
        throw new AgentError(`${given === undefined ? "Missing" : `Unknown ${o.name} "${given}".`} ${o.name}: one of ${allowed}.`);
      }
      choice[o.name] = value;
    }
    const credit = agentName(req.headers, agent);
    const order = await agentCreateOrder(shop.slug, options.length ? choice : undefined, agent, credit);
    // An assistant may hand the buyer this link instead of opening it; a click goes straight to paying.
    if (isPersonClick(req.headers)) return new Response(null, { status: 303, headers: { ...headers, Location: order.pay_url } });
    return NextResponse.json({ ...order, agent_name: credit }, { headers });
  } catch (err) {
    if (err instanceof AgentError) {
      // A person whose link lacked a size or colour picks it on the shop page instead.
      if (isPersonClick(req.headers) && !err.message.startsWith("No live shop")) {
        return new Response(null, { status: 303, headers: { ...headers, Location: `/${(await ctx.params).slug}` } });
      }
      return NextResponse.json({ error: err.message }, { status: err.message.startsWith("No live shop") ? 404 : 400, headers });
    }
    throw err;
  }
}
