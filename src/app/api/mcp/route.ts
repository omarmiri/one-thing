import { NextResponse } from "next/server";
import { z } from "zod";
import { agentCreateOrder, AgentError, agentGetOrder, agentProduct, liveShop, searchShops } from "@/lib/agent";
import { recordVisit } from "@/lib/stats";

/**
 * OneThing's MCP server, so AI agents can shop here: find a shop, read the product, order it.
 * Streamable HTTP transport in its stateless form: each POST carries one JSON-RPC message (or a
 * batch) and gets a plain JSON reply, no session and no SSE. Add it to an MCP client as
 * <APP_URL>/api/mcp. Every payment still needs the buyer's approval at PayPal.
 */

const VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05"];

const INSTRUCTIONS =
  "OneThing hosts one-product shops. search_shops finds them, get_product describes one. " +
  "To buy: create_order returns pay_url, a link on this site that's safe to show in chat. Give it to the buyer; " +
  "it opens PayPal, where they approve the payment (you can't approve for them). When they say they've paid, " +
  "call get_order: once status is paid it returns the access code, download link or shipping details.";

const slug = z.string().min(1).max(60).describe("The shop's link name, e.g. \"bluemug\" (from search_shops or the shop URL)");

const TOOLS = {
  search_shops: {
    description: "Find live OneThing shops by keywords (product name, category, what it's for). Empty query lists recent shops.",
    input: z.object({ query: z.string().max(200).optional(), limit: z.number().int().min(1).max(25).optional() }),
    run: async (a: { query?: string; limit?: number }) => ({ shops: await searchShops(a.query, a.limit) }),
  },
  get_product: {
    description: "Everything about one shop's product: description, price, shipping, delivery, availability, images, FAQ.",
    input: z.object({ shop: slug }),
    run: async (a: { shop: string }) => agentProduct(await liveShop(a.shop)),
  },
  create_order: {
    description:
      "Order one unit with PayPal. Returns order_id and pay_url. Show pay_url to the buyer as a link: it opens PayPal, " +
      "where they pay (PayPal or card; PayPal asks for a shipping address for physical items). Nothing is charged until they do. " +
      "If get_product lists options, pass the buyer's pick for each, e.g. {\"Size\": \"M\", \"Color\": \"Black\"}.",
    input: z.object({
      shop: slug,
      options: z.record(z.string().max(20), z.string().max(30)).optional().describe("One value per option from get_product, keyed by option name"),
    }),
    run: async (a: { shop: string; options?: Record<string, string> }) => agentCreateOrder(a.shop, a.options),
  },
  get_order: {
    description:
      "Status of an order from create_order: awaiting_buyer_approval, paid, declined, sold_out, expired or failed, with next_step. " +
      "Once paid, delivery holds what the buyer got: an access code, a download link, or shipping details and tracking.",
    input: z.object({ order_id: z.string().min(1).max(64) }),
    run: async (a: { order_id: string }) => agentGetOrder(a.order_id),
  },
} as const;

type Rpc = { jsonrpc: "2.0"; id?: string | number | null; method: string; params?: Record<string, unknown> };

const result = (id: Rpc["id"], r: unknown) => ({ jsonrpc: "2.0", id, result: r });
const failure = (id: Rpc["id"], code: number, message: string) => ({ jsonrpc: "2.0", id: id ?? null, error: { code, message } });

async function handle(msg: Rpc, h: Headers) {
  const { id, method, params = {} } = msg;
  switch (method) {
    case "initialize": {
      const asked = String(params.protocolVersion ?? "");
      return result(id, {
        protocolVersion: VERSIONS.includes(asked) ? asked : VERSIONS[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "onething", title: "OneThing shops", version: "1.0.0" },
        instructions: INSTRUCTIONS,
      });
    }
    case "ping":
      return result(id, {});
    case "tools/list":
      return result(id, {
        tools: Object.entries(TOOLS).map(([name, t]) => ({
          name,
          description: t.description,
          inputSchema: z.toJSONSchema(t.input),
          annotations: { readOnlyHint: name !== "create_order", openWorldHint: true },
        })),
      });
    case "tools/call": {
      const tool = TOOLS[String(params.name) as keyof typeof TOOLS];
      if (!tool) return failure(id, -32602, `Unknown tool: ${String(params.name)}`);
      const args = tool.input.safeParse(params.arguments ?? {});
      // Tool errors go back as results with isError, so the model can read them and adjust.
      const reply = (data: unknown, isError = false) =>
        result(id, {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
          ...(!isError && { structuredContent: data }),
          isError,
        });
      if (!args.success) return reply({ error: args.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") }, true);
      // A tool call about one shop (get_product, create_order) is an agent visit to it.
      const about = (args.data as { shop?: string }).shop;
      if (about) await recordVisit({ slug: about }, h, "agent");
      try {
        return reply(await (tool.run as (a: unknown) => Promise<unknown>)(args.data));
      } catch (err) {
        if (err instanceof AgentError) return reply({ error: err.message }, true);
        console.error(`mcp ${String(params.name)}:`, err);
        return reply({ error: "Something went wrong on our side. Try again." }, true);
      }
    }
    default:
      return method.startsWith("notifications/") ? null : failure(id, -32601, `Method not found: ${method}`);
  }
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => undefined)) as Rpc | Rpc[] | undefined;
  if (!body || typeof body !== "object") return NextResponse.json(failure(null, -32700, "Parse error"), { status: 400 });
  const batch = Array.isArray(body);
  const replies = (await Promise.all((batch ? body : [body]).map((m) => (m?.method ? handle(m, req.headers) : failure(m?.id, -32600, "Invalid request"))))).filter(
    (r) => r !== null,
  );
  // Only notifications: accepted, nothing to say.
  if (!replies.length) return new NextResponse(null, { status: 202 });
  return NextResponse.json(batch ? replies : replies[0]);
}

// No server-initiated stream and no sessions to end.
export const GET = () => NextResponse.json(failure(null, -32000, "Use POST. This server has no event stream."), { status: 405, headers: { allow: "POST" } });
export const DELETE = () => new NextResponse(null, { status: 405, headers: { allow: "POST" } });
