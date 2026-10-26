import { NextResponse } from "next/server";
import { searchShops } from "@/lib/agent";
import { appUrl } from "@/lib/ids";

/**
 * Gallery shops for agents that can only fetch URLs, the GET twin of the MCP search_shops tool.
 * No q lists the newest. Buying still needs the MCP server or the shop page.
 */
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const q = params.get("q")?.slice(0, 200) || undefined;
  const limit = Math.min(Math.max(Number(params.get("limit")) || 10, 1), 25);
  return NextResponse.json({ ...(await searchShops(q, limit)), mcp_server: `${appUrl()}/api/mcp` });
}
