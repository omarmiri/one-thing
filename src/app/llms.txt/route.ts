import { searchShops } from "@/lib/agent";
import { appUrl } from "@/lib/ids";

export const dynamic = "force-dynamic";

/**
 * /llms.txt: the one URL to give an AI that can only read web pages. It explains how to find,
 * read and buy from OneThing shops with plain GETs, and lists the gallery's shops right here so
 * a model can start without another fetch. Agents with MCP get pointed to the server.
 */
export async function GET() {
  const base = appUrl();
  const shops = await searchShops(undefined, 25);
  const list = shops.length
    ? shops.map((s) => `- [${s.name}](${base}/api/agent/shops/${s.shop}): ${s.price ?? "sold at a retailer"}, ${s.kind}. ${s.headline}`).join("\n")
    : "- No shops in the gallery yet.";

  const text = `# OneThing

> One-product shops paid with PayPal. Every shop is one product on one page. AI assistants can
> find shops, read products and check orders with plain GET requests (JSON, no key). The buyer
> always pays at PayPal themselves; no agent can pay for them.

## Shops in the gallery

${list}

## Find and read

- [Search the gallery](${base}/api/agent/shops?q=skates): \`GET ${base}/api/agent/shops?q=<words>&limit=<1-25>\`. Leave out \`q\` to list the newest shops.
- Read one product: \`GET ${base}/api/agent/shops/<shop>\`. Price, shipping, \`total\` (shipping included), availability, sizes or colours, delivery, photos and FAQ.

## Buy

- **If you can only read web pages:** show the buyer the product's \`url\` (the shop page, \`${base}/<shop>\`). They pick any size or colour there and pay with PayPal. Afterwards they land on a thank-you page whose link ends in \`?order=<order_id>\`; ask them to paste it to you.
- **If you can call MCP tools:** connect to \`${base}/api/mcp\` (Streamable HTTP, no authentication). \`create_order\` returns a \`pay_url\` to show the buyer as a link; when they say they've paid, call \`get_order\`.

## Check an order

- \`GET ${base}/api/agent/orders/<order_id>\`: \`status\` is \`paid\`, \`awaiting_buyer_approval\`, \`declined\`, \`sold_out\`, \`expired\` or \`failed\`, with a \`next_step\`. Once paid, \`delivery\` has what the buyer got: an access code (and a link that unlocks the app), a download link, or the shipping address and tracking.

## More

- [API docs](https://omarmiri.github.io/one-thing/): every endpoint, with sample requests.
- [OpenAPI spec](${base}/openapi.yaml)
`;
  return new Response(text, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=300", "access-control-allow-origin": "*" },
  });
}
