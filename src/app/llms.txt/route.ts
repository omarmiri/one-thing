import { agentProduct } from "@/lib/agent";
import { appUrl } from "@/lib/ids";
import { listLiveShops } from "@/lib/shops";

export const dynamic = "force-dynamic";

/** One gallery shop as a list item, with its order links written out in full. */
function shopLines(p: ReturnType<typeof agentProduct>, base: string) {
  const price = !("price" in p) || !p.price
    ? "sold at a retailer"
    : p.total && p.total.amount !== p.price.amount
      ? `${p.price.label} + shipping, $${p.total.amount.toFixed(2)} total`
      : p.price.label;
  const head = `- [${p.name}](${base}/api/agent/shops/${p.shop}): ${price}, ${p.kind}. ${p.headline}`;
  if ("offers" in p) return `${head}\n  - Bought at a retailer: see the product link.`;
  if ("variants" in p && p.variants) {
    const open = p.variants.filter((v) => v.order_url);
    if (!open.length) return `${head} (sold out)`;
    return [head, ...open.map((v) => `  - Order ${Object.values(v.choice).join(" / ")}: ${v.order_url}`)].join("\n");
  }
  return "order_url" in p && p.order_url ? `${head}\n  - Order: ${p.order_url}` : `${head} (sold out)`;
}

/**
 * /llms.txt: the one URL to give an AI that can only read web pages. It explains how to find,
 * read and buy from OneThing shops with plain GETs, and lists the gallery's shops with their
 * order links written out, because some assistants only open URLs they have been shown.
 */
export async function GET() {
  const base = appUrl();
  const products = (await listLiveShops(25)).map(agentProduct);
  const list = products.length ? products.map((p) => shopLines(p, base)).join("\n") : "- No shops in the gallery yet.";

  const text = `# OneThing

> One-product shops paid with PayPal. Every shop is one product on one page. AI assistants can
> find shops, read products, place orders and check them with plain GET requests (JSON, no key).
> The buyer always pays at PayPal themselves; no assistant can pay for them.

## Shops in the gallery

${list}

## Buy

When the buyer has picked a product (and a size or colour, if it has them) and said to buy it:

1. Open its **Order** link above. It creates the order and returns JSON with \`pay_url\` and \`status_url\`. Nothing is charged yet. Every time an Order link is opened it makes a new order, so open it once, and only after the buyer says to buy.
2. Show the buyer \`pay_url\` as a link. They pay at PayPal themselves (and give a shipping address there for physical items).
3. When they say they've paid, open \`status_url\` and tell them what they got (\`delivery\`): an access code, a download link, or the shipping details.

If \`status_url\` says \`declined\`, they can open \`pay_url\` again; \`expired\` means open the Order link for a new order. The reply's \`next_step\` always says what to do.

Every Order link is \`GET ${base}/api/agent/shops/<shop>/order\`, with the buyer's pick as query parameters named after the product's options, e.g. \`?Color=Ice+Blue&Size=L\` (names and values in any case). Products without options take no parameters. A missing or unknown pick gets a 400 listing the valid values. Use the links above as written when you can.

Optionally add \`agent=<your name>\` to any order or product link (e.g. \`&agent=ChatGPT\`, or \`?agent=ChatGPT\` when the link has no \`?\`), so the seller can see which assistant sent the buyer.

## Find and read

- [Search the gallery](${base}/api/agent/shops?q=skates): \`GET ${base}/api/agent/shops?q=<words>&limit=<1-25>\`. Leave out \`q\` to list the newest shops.
- Read one product: \`GET ${base}/api/agent/shops/<shop>\`. Price, shipping, \`total\` (shipping included), availability, sizes or colours, delivery, photos, FAQ, and the order links (\`order_url\`, or \`variants[].order_url\`).

## Check an order

- \`GET ${base}/api/agent/orders/<order_id>\` (the \`status_url\` an Order link returns): \`status\` is \`paid\`, \`awaiting_buyer_approval\`, \`declined\`, \`sold_out\`, \`expired\` or \`failed\`, with a \`next_step\`. Once paid, \`delivery\` has what the buyer got.

## MCP

Assistants that can call MCP tools can use \`${base}/api/mcp\` (Streamable HTTP, no authentication) instead: \`search_shops\`, \`get_product\`, \`create_order\`, \`get_order\`.

## More

- [API docs](https://omarmiri.github.io/one-thing/): every endpoint, with sample requests.
- [OpenAPI spec](${base}/openapi.yaml)
`;
  return new Response(text, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=300", "access-control-allow-origin": "*" },
  });
}
