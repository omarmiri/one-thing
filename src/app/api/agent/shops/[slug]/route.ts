import { NextResponse } from "next/server";
import { agentProduct, AgentError, liveShop } from "@/lib/agent";
import { appUrl } from "@/lib/ids";
import { agentName, isPersonClick, recordVisit } from "@/lib/stats";

/** The product as JSON for AI agents and other machines. Buying goes through /api/mcp. */
export async function GET(req: Request, ctx: RouteContext<"/api/agent/shops/[slug]">) {
  try {
    const shop = await liveShop((await ctx.params).slug);
    // A buyer who clicks this link (an assistant may show it) gets the shop page, not JSON.
    // ?view=json keeps the JSON for people who want to read it.
    if (isPersonClick(req.headers) && new URL(req.url).searchParams.get("view") !== "json") {
      return new Response(null, { status: 303, headers: { Location: `/${shop.slug}` } });
    }
    // ?agent=<name>: optional, an agent naming itself for the seller's stats. agent_name says back
    // who the visit was credited to, and the order links we return carry the name on.
    const agent = new URL(req.url).searchParams.get("agent");
    await recordVisit(shop, req.headers, "agent", agent);
    return NextResponse.json({ ...agentProduct(shop, agent), mcp_server: `${appUrl()}/api/mcp`, agent_name: agentName(req.headers, agent) });
  } catch (err) {
    if (err instanceof AgentError) return NextResponse.json({ error: err.message }, { status: 404 });
    throw err;
  }
}
