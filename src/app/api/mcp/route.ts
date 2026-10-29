import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { agentCreateOrder, AgentError, agentGetOrder, agentProduct, liveShop, searchShops, SHOW_BUYER } from "@/lib/agent";
import { overLimit } from "@/lib/rateLimit";
import { agentName, recordVisit } from "@/lib/stats";
import { WIDGET_HTML, WIDGET_MIME, WIDGET_URI, widgetMeta, widgetToolMeta } from "@/lib/widget";

/**
 * OneThing's MCP server, so AI agents can shop here: find a shop, read the product, order it.
 * Streamable HTTP transport, stateless: each POST carries one JSON-RPC message (or a batch) and
 * gets a plain JSON reply, no SSE. Add it to an MCP client as <APP_URL>/api/mcp. Every payment
 * still needs the buyer's approval at PayPal.
 *
 * The one thing kept between requests is who the client is. It names itself only in initialize
 * (clientInfo.name: "claude-ai", "cursor"…), so the Mcp-Session-Id we answer with carries that
 * name, and clients send the session id back on every later request. Nothing is stored and any
 * session id is accepted; the name only labels the visit in the seller's stats.
 */

const VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05"];

const INSTRUCTIONS =
  "OneThing hosts one-product shops. search_shops finds them, get_product describes one. " +
  "To buy: create_order returns pay_url, a link on this site that's safe to show in chat. Give it to the buyer; " +
  "it opens PayPal, where they approve the payment (you can't approve for them). When they say they've paid, " +
  "call get_order: once status is paid it returns the access code, download link or shipping details. " +
  "Buyers have the best experience with short replies, the product photo and clickable links: every tool returns show_buyer, " +
  "the Markdown reply to show (the product photo, options to pick from, the pay link, the receipt link). Show it exactly as " +
  "written, photo included, with little else.";

// For hosts that draw the product card (src/lib/widget.ts): the card already shows the real photos,
// options and pay button. Asked to show show_buyer "photo included" where it can't display our
// Markdown image, ChatGPT made up product pictures of its own.
const CARD_INSTRUCTIONS =
  "OneThing hosts one-product shops. search_shops finds them, get_product describes one, create_order starts a PayPal " +
  "checkout and get_order says once it's paid. Results appear to the buyer as a OneThing card with the real product photos, " +
  "options and a Pay with PayPal button, so reply in a sentence at most. Never add, generate, search for or describe product " +
  "images: the card has the real ones. The buyer pays at PayPal (you can't approve for them); when they say they've paid, call " +
  "get_order and show its show_buyer (the access code, download link or shipping details).";
const CARD_NOTE =
  "The buyer sees this as the OneThing card: the real photos, options and pay button. Reply in a sentence at most, and don't add or make up images.";

/** A tool result as a card host's model should see it: no Markdown to repeat, no photo to stand in for. */
function forCardHost(name: string, data: Record<string, unknown>) {
  const out = { ...data };
  const carded = name !== "get_order";
  if (typeof out.show_buyer === "string") {
    out.show_buyer = carded ? CARD_NOTE : out.show_buyer.split("\n").filter((l) => !l.startsWith("![")).join("\n");
  }
  for (const k of ["next_step", "how_to_buy"]) {
    if (typeof out[k] === "string") out[k] = (out[k] as string).replace(SHOW_BUYER, carded ? "" : "Show show_buyer as written, and add no images.").trim();
  }
  return out;
}

const slug = z.string().min(1).max(60).describe("The shop's link name, e.g. \"bluemug\" (from search_shops or the shop URL)");

const TOOLS = {
  search_shops: {
    description:
      "Browse or search the OneThing gallery: one-product shops you can buy from with PayPal. Use it whenever the buyer asks what's on OneThing or wants something from it. Leave query empty to browse (e.g. \"find me something interesting\"); give keywords (product name, category, what it's for) to search. A query that matches nothing returns the whole gallery with matched: false.",
    input: z.object({ query: z.string().max(200).optional(), limit: z.number().int().min(1).max(25).optional() }),
    run: async (a: { query?: string; limit?: number }) => searchShops(a.query, a.limit),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    _meta: widgetToolMeta("Looking through the shops…", "Found shops"),
  },
  get_product: {
    description: "Everything about one shop's product: description, price, shipping, delivery, availability, images, FAQ.",
    input: z.object({ shop: slug }),
    run: async (a: { shop: string }) => agentProduct(await liveShop(a.shop)),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    _meta: widgetToolMeta("Opening the shop…", "Here it is"),
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
    run: async (a: { shop: string; options?: Record<string, string> }, agent: string) => agentCreateOrder(a.shop, a.options, null, agent),
    // Starts a PayPal order but charges nothing: the buyer approves at PayPal. A new order each call.
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    _meta: widgetToolMeta("Starting checkout…", "Ready to pay"),
  },
  get_order: {
    description:
      "Status of an order from create_order: awaiting_buyer_approval, paid, declined, sold_out, expired or failed, with next_step. " +
      "Once paid, delivery holds what the buyer got: an access code, a download link, or shipping details and tracking.",
    input: z.object({ order_id: z.string().min(1).max(64) }),
    run: async (a: { order_id: string }) => agentGetOrder(a.order_id),
    // Read-only to the agent: it may capture a payment, but only one the buyer already approved at
    // PayPal, so a confirmation prompt on "have I paid?" would ask the buyer twice.
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    _meta: undefined,
  },
} as const;

type Rpc = { jsonrpc: "2.0"; id?: string | number | null; method: string; params?: Record<string, unknown> };

const result = (id: Rpc["id"], r: unknown) => ({ jsonrpc: "2.0", id, result: r });
const failure = (id: Rpc["id"], code: number, message: string) => ({ jsonrpc: "2.0", id: id ?? null, error: { code, message } });

// Session id "<random>.<base64url client name>[.ui]": visible ASCII, as the transport requires.
// ".ui" marks a client that draws the product card, so later calls know without asking again.
const sessionFor = (client: string, card: boolean) =>
  `${randomUUID()}.${Buffer.from(client.slice(0, 30)).toString("base64url")}${card ? ".ui" : ""}`;
const clientOf = (session: string | null) => (session?.includes(".") ? Buffer.from(session.split(".")[1], "base64url").toString() : null);
const cardOf = (session: string | null) => session?.split(".")[2] === "ui";
// A client draws the card when it says it speaks MCP Apps, or it's ChatGPT (which may not say so).
const drawsCard = (init: { capabilities?: unknown; clientInfo?: { name?: unknown } }, h: Headers) =>
  Boolean((init.capabilities as { extensions?: Record<string, unknown> } | undefined)?.extensions?.["io.modelcontextprotocol/ui"]) ||
  /openai|chatgpt/i.test(`${String(init.clientInfo?.name ?? "")} ${h.get("user-agent") ?? ""}`);

async function handle(msg: Rpc, h: Headers, client: string | null, card: boolean) {
  const { id, method, params = {} } = msg;
  switch (method) {
    case "initialize": {
      const asked = String(params.protocolVersion ?? "");
      return result(id, {
        protocolVersion: VERSIONS.includes(asked) ? asked : VERSIONS[0],
        capabilities: { tools: { listChanged: false }, resources: { listChanged: false } },
        serverInfo: { name: "onething", title: "OneThing shops", version: "1.0.0" },
        instructions: card ? CARD_INSTRUCTIONS : INSTRUCTIONS,
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
          annotations: t.annotations,
          ...(t._meta && { _meta: t._meta }),
        })),
      });
    // The product card (src/lib/widget.ts), for hosts that draw tool results as UI.
    case "resources/list":
      return result(id, { resources: [{ uri: WIDGET_URI, name: "OneThing product card", mimeType: WIDGET_MIME, _meta: widgetMeta() }] });
    case "resources/templates/list":
      return result(id, { resourceTemplates: [] });
    case "resources/read":
      if (params.uri !== WIDGET_URI) return failure(id, -32002, `Resource not found: ${String(params.uri)}`);
      return result(id, { contents: [{ uri: WIDGET_URI, mimeType: WIDGET_MIME, text: WIDGET_HTML, _meta: widgetMeta() }] });
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
      if (about) await recordVisit({ slug: about }, h, "agent", client);
      const over = params.name === "create_order" ? await overLimit("order", h) : null;
      if (over) return reply({ error: over.error }, true);
      try {
        // agent_name says back who this call is credited to in the seller's stats (and on its order).
        const agent = agentName(h, client);
        const data = { ...(await (tool.run as (a: unknown, agent: string) => Promise<object>)(args.data, agent)), agent_name: agent };
        return reply(card ? forCardHost(String(params.name), data) : data);
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
  const msgs = batch ? body : [body];
  const init = msgs.find((m) => m?.method === "initialize")?.params as { capabilities?: unknown; clientInfo?: { name?: unknown } } | undefined;
  const name = init?.clientInfo?.name;
  const session = init ? sessionFor(typeof name === "string" && name ? name : "Unknown", drawsCard(init, req.headers)) : null;
  const sid = session ?? req.headers.get("mcp-session-id");
  const client = clientOf(sid);
  // Sessions from before the card existed carry no mark; ChatGPT's user agent still gives it away.
  const card = cardOf(sid) || /openai|chatgpt/i.test(req.headers.get("user-agent") ?? "");
  const replies = (await Promise.all(msgs.map((m) => (m?.method ? handle(m, req.headers, client, card) : failure(m?.id, -32600, "Invalid request"))))).filter(
    (r) => r !== null,
  );
  // Only notifications: accepted, nothing to say.
  if (!replies.length) return new NextResponse(null, { status: 202 });
  return NextResponse.json(batch ? replies : replies[0], session ? { headers: { "mcp-session-id": session } } : undefined);
}

// No server-initiated stream, and sessions hold nothing to end.
export const GET = () => NextResponse.json(failure(null, -32000, "Use POST. This server has no event stream."), { status: 405, headers: { allow: "POST" } });
export const DELETE = () => new NextResponse(null, { status: 405, headers: { allow: "POST" } });
