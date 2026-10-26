import { NextResponse } from "next/server";
import { AgentError, agentGetOrder } from "@/lib/agent";
import { agentName } from "@/lib/stats";

/**
 * An order's status and, once paid, what the buyer got: the GET twin of the MCP get_order tool,
 * for agents that can only fetch URLs. Anyone with the order id can already open its thank-you
 * page, so this shows nothing more than that does. ?agent=<name> is only said back (agent_name).
 */
export async function GET(req: Request, ctx: RouteContext<"/api/agent/orders/[id]">) {
  try {
    const order = await agentGetOrder((await ctx.params).id);
    const agent = agentName(req.headers, new URL(req.url).searchParams.get("agent"));
    return NextResponse.json({ ...order, agent_name: agent }, { headers: { "cache-control": "no-store" } });
  } catch (err) {
    if (err instanceof AgentError) return NextResponse.json({ error: err.message }, { status: 404 });
    throw err;
  }
}
