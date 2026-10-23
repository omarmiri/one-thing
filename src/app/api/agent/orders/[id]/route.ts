import { NextResponse } from "next/server";
import { AgentError, agentGetOrder } from "@/lib/agent";

/**
 * An order's status and, once paid, what the buyer got: the GET twin of the MCP get_order tool,
 * for agents that can only fetch URLs. Anyone with the order id can already open its thank-you
 * page, so this shows nothing more than that does.
 */
export async function GET(_req: Request, ctx: RouteContext<"/api/agent/orders/[id]">) {
  try {
    return NextResponse.json(await agentGetOrder((await ctx.params).id), { headers: { "cache-control": "no-store" } });
  } catch (err) {
    if (err instanceof AgentError) return NextResponse.json({ error: err.message }, { status: 404 });
    throw err;
  }
}
