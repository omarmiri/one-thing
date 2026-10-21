import { NextResponse } from "next/server";
import { agentProduct, AgentError, liveShop } from "@/lib/agent";
import { appUrl } from "@/lib/ids";

/** The product as JSON for AI agents and other machines. Buying goes through /api/mcp. */
export async function GET(_req: Request, ctx: RouteContext<"/api/agent/shops/[slug]">) {
  try {
    const shop = await liveShop((await ctx.params).slug);
    return NextResponse.json({ ...agentProduct(shop), mcp_server: `${appUrl()}/api/mcp` });
  } catch (err) {
    if (err instanceof AgentError) return NextResponse.json({ error: err.message }, { status: 404 });
    throw err;
  }
}
