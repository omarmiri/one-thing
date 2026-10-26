import { NextResponse } from "next/server";
import { agentCreateOrder, AgentError, liveShop } from "@/lib/agent";
import { agentName, recordVisit } from "@/lib/stats";

/**
 * Orders one unit with a GET: create_order for AI assistants that can only fetch URLs. The
 * buyer's pick comes as query parameters (?Size=9). Like create_order, nothing is charged: the
 * reply's pay_url is where the buyer pays at PayPal, and status_url says when they have.
 *
 * A GET that creates something gets opened by link previewers too. That leaves an unpaid order
 * at most: stock is only taken when a payment is captured, and PayPal drops unapproved orders.
 */
export async function GET(req: Request, ctx: RouteContext<"/api/agent/shops/[slug]/order">) {
  const headers = { "cache-control": "no-store", "x-robots-tag": "noindex, nofollow" };
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
    return NextResponse.json({ ...order, agent_name: credit }, { headers });
  } catch (err) {
    if (err instanceof AgentError) {
      return NextResponse.json({ error: err.message }, { status: err.message.startsWith("No live shop") ? 404 : 400, headers });
    }
    throw err;
  }
}
