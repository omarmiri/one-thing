import { appUrl } from "@/lib/ids";

export const dynamic = "force-dynamic";

/**
 * /llms.txt: the one URL to give an AI that can only read web pages. It explains how to find,
 * read and buy from OneThing shops with plain GETs. It lists no shops: it writes out search links
 * instead, because some assistants only open URLs they have been shown, and every reply from
 * there on writes out the next link (search → product → order → status).
 */
export async function GET() {
  const base = appUrl();
  const search = (q: string) => `${base}/api/agent/shops?q=${encodeURIComponent(q).replace(/%20/g, "+")}`;

  const text = `# OneThing

> One-product shops paid with PayPal. Every shop is one product on one page. AI assistants can
> find shops, read products, place orders and check them with plain GET requests (JSON, no key).
> The buyer always pays at PayPal themselves; no assistant can pay for them.

## Find a shop

Search the gallery with the buyer's own words: \`GET ${base}/api/agent/shops?q=<words>&limit=<1-25>\`. Leave out \`q\` to list the newest shops. Each result has a \`product_url\` to open next.

- [Newest shops](${base}/api/agent/shops)
- [Search: t-shirt](${search("t-shirt")})
- [Search: game](${search("game")})
- [Search: book](${search("book")})
- [Search: print](${search("print")})
- [Search: gift](${search("gift")})

Given a shop page like \`${base}/<shop>\`, its product is at \`${base}/api/agent/shops/<shop>\`.

## Read a product

\`GET ${base}/api/agent/shops/<shop>\` (the \`product_url\` from a search): price, shipping, \`total\` (shipping included), availability, sizes or colours, delivery, photos, FAQ, and the order links written out in full (\`order_url\`, or one \`variants[].order_url\` per size or colour).

## Talking to the buyer

Buyers have the best experience with short replies, the product photo and clickable links. Every JSON reply includes \`show_buyer\`: the reply to show the buyer, in Markdown, with the photo, the options to pick from and the links already written as links. **Show \`show_buyer\` exactly as written, photo included**, with little of your own around it. The flow it follows:

1. **The product:** its photo first, as a Markdown image, then name, price, one line about it, then the choices, e.g. "Size: S · M · L" and "Which size?"
2. **The pay link** once they've picked and said to buy: the photo again, then "**[Pay $42.00 with PayPal](…)**". Nothing is charged until they pay at PayPal.
3. **Done:** what they got (access code, download link or shipping details) and "[Your receipt](…)".

Raw URLs, JSON and order ids are rarely useful to the buyer. Write links as Markdown links so they can click them.

## Buy

When the buyer has picked a product (and a size or colour, if it has them) and said to buy it:

1. Open its order link from the product JSON (\`order_url\`, or the matching \`variants[].order_url\`). It creates the order and returns JSON with \`show_buyer\`, \`pay_url\` and \`status_url\`. Nothing is charged yet. Every time an order link is opened it makes a new order, so open it once, and only after the buyer says to buy.
2. Give the buyer the pay link (\`show_buyer\` has it as a link). They pay at PayPal themselves (and give a shipping address there for physical items).
3. When they say they've paid, open \`status_url\` and tell them what they got (\`show_buyer\` again, or \`delivery\`), with their receipt link.

If \`status_url\` says \`declined\`, they can open \`pay_url\` again; \`expired\` means open the order link for a new order. The reply's \`next_step\` always says what to do.

Every order link is \`GET ${base}/<shop>/buy\` (also at \`/api/agent/shops/<shop>/order\`), with the buyer's pick as query parameters named after the product's options, e.g. \`?Color=Ice+Blue&Size=L\` (names and values in any case). Products without options take no parameters. A missing or unknown pick gets a 400 listing the valid values. Use the links from the product JSON as written when you can.

Optionally add \`agent=<your name>\` to any order or product link (e.g. \`&agent=ChatGPT\`, or \`?agent=ChatGPT\` when the link has no \`?\`), so the seller can see which assistant sent the buyer. Replies say back who they credited in \`agent_name\`, and the links they return carry your name on.

## Check an order

- \`GET ${base}/o/<order_id>/status\` (the \`status_url\` an order link returns): \`status\` is \`paid\`, \`awaiting_buyer_approval\`, \`declined\`, \`sold_out\`, \`expired\` or \`failed\`, with a \`next_step\`. Once paid, \`delivery\` has what the buyer got.

## MCP

Assistants that can call MCP tools can use \`${base}/api/mcp\` (Streamable HTTP, no authentication) instead: \`search_shops\`, \`get_product\`, \`create_order\`, \`get_order\`. Setup steps for each assistant: ${base}/mcp

## More

- [API docs](https://omarmiri.github.io/one-thing/): every endpoint, with sample requests.
- [OpenAPI spec](${base}/openapi.yaml)
`;
  return new Response(text, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=300", "access-control-allow-origin": "*" },
  });
}
