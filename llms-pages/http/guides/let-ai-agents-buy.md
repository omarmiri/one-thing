# Let AI agents buy

Source: /#/http/x-redirect/cGFnZSUzQWd1aWRlcyUyRmFnZW50cw

Every live shop is agent-ready. An AI shopping agent can find it, read the product and place an
order, and the buyer approves the payment at PayPal. No agent can spend someone's money on its own.

There are two ways in, depending on what the agent can do:

| The agent can… | Use | Find | Read | Order | Check the order |
|---|---|---|---|---|---|
| Call MCP tools (Claude, ChatGPT Developer Mode, Grok, agent SDKs) | The MCP server | `search_shops` | `get_product` | `create_order` | `get_order` |
| Only fetch URLs (free-tier ChatGPT, Grok, Gemini; plain HTTP) | Plain GETs | `listAgentShops` | `getAgentProduct` | `orderByLink` | `getAgentOrder` |

Both return the same JSON. Every live shop page also carries its facts as schema.org `Product`
JSON-LD and links to its product JSON (`<link rel="alternate" type="application/json">`), so
agents that browse find them too.


# Start here: /llms.txt

An AI assistant without MCP (free-tier ChatGPT or Gemini, for example) won't find the API on its
own. Give it one URL:

> Read https://one-thing-ash0.onrender.com/llms.txt and help me buy something from the gallery.

```bash
curl https://one-thing-ash0.onrender.com/llms.txt
```

It's plain text, written for models: the gallery's shops with their prices, product JSON links
and order links, then how to buy in three steps (open the order link, show the buyer `pay_url`,
open `status_url` once they've paid) and how to search, read and check orders. Every page on the site links to it, and the home page
and gallery show the link as text too.


# Plain GETs

No key, no session. These samples use the hosted sandbox deployment.

**Say who you are (optional).** Add `agent=<your name>` to a product or order link
(`?agent=my-shopping-bot`, or `&agent=…` after option picks) and the seller's stats show your
agent by name. A recognised user agent (`ChatGPT-User`, `Claude-User`…) takes precedence.

## Find shops

```bash
curl "https://one-thing-ash0.onrender.com/api/agent/shops?q=skates&limit=5"
```

```json
{
  "shops": [
    {
      "shop": "vintageskates",
      "name": "Vintage Cream and Red Roller Skates",
      "kind": "physical",
      "headline": "Classic quad skates crafted with walnut burl heels",
      "price": "$240.00",
      "url": "https://one-thing-ash0.onrender.com/vintageskates"
    }
  ],
  "mcp_server": "https://one-thing-ash0.onrender.com/api/mcp"
}
```

Leave out `q` to list the newest gallery shops. Only shops approved for the gallery are listed;
any live shop can still be read by its link name.

## Read a product

```bash
curl https://one-thing-ash0.onrender.com/api/agent/shops/vintageskates
```

```json
{
  "shop": "vintageskates",
  "name": "Vintage Cream and Red Roller Skates",
  "kind": "physical",
  "price": { "amount": 240, "currency": "USD", "label": "$240.00" },
  "shipping": { "amount": 15, "currency": "USD", "ships_to": ["US"] },
  "total": { "amount": 255, "currency": "USD" },
  "delivery": "Shipped. PayPal collects the buyer's address at checkout.",
  "availability": "in_stock (9 left)",
  "how_to_buy": "Call create_order on the OneThing MCP server, then give the buyer its pay_url to pay at PayPal.",
  "mcp_server": "https://one-thing-ash0.onrender.com/api/mcp"
}
```

(Shortened: the full reply also has the description, highlights, details, FAQ, images and, when
the buyer picks a size or colour, `options` and `variants` with stock for each.)

`total` already includes shipping, so an agent can quote the real price.

## Order with a link

An assistant that can only fetch URLs can't send the POST that `create_order` is, so each product
also has an order link: a GET that places the order. The product JSON spells it out
(`order_url`, or `variants[].order_url` per size or colour), and so does `/llms.txt`, because
some assistants only open URLs they've been shown.

```bash
curl "https://one-thing-ash0.onrender.com/api/agent/shops/vintageskates/order?Size=9"
```

```json
{
  "order_id": "pX4kR9tVb2nQ7sLe",
  "status": "awaiting_buyer_approval",
  "total": "$255.00",
  "options": { "Size": "9" },
  "pay_url": "https://one-thing-ash0.onrender.com/o/pX4kR9tVb2nQ7sLe",
  "status_url": "https://one-thing-ash0.onrender.com/api/agent/orders/pX4kR9tVb2nQ7sLe",
  "next_step": "Show pay_url to the buyer as a link. …"
}
```

Nothing is charged: the assistant shows the buyer `pay_url`, and they pay at PayPal. Every
request makes a new order, so open the link once, after the buyer says to buy. Option names and
values aren't case-sensitive; a missing or unknown one gets a 400 that lists the valid values.

## Check an order

```bash
curl https://one-thing-ash0.onrender.com/api/agent/orders/pX4kR9tVb2nQ7sLe
```

```json
{
  "order_id": "pX4kR9tVb2nQ7sLe",
  "status": "paid",
  "product": "Raptor Rush: Browser Edition",
  "amount": { "item": 2.99, "shipping": 0, "total": 2.99, "currency": "USD" },
  "total": "$2.99",
  "paid_at": "2026-10-22T03:12:50Z",
  "receipt_url": "https://one-thing-ash0.onrender.com/raptorrush/thanks?order=pX4kR9tVb2nQ7sLe",
  "delivery": {
    "type": "access_code",
    "access_code": "K7QF-M2XP-9HTD",
    "start_url": "https://www.miriogames.com/raptor-rush/play/?code=K7QF-M2XP-9HTD"
  }
}
```

This is the `status_url` an order link or `create_order` returns. An order the buyer placed on
the shop page can be checked too, from the `?order=` in their thank-you page link.


# The MCP server

Add `https://one-thing-ash0.onrender.com/api/mcp` to any MCP client as a Streamable HTTP server,
with no authentication. For Claude Code:

```bash
claude mcp add --transport http onething https://one-thing-ash0.onrender.com/api/mcp
```

The server is stateless: each POST carries one JSON-RPC 2.0 message and gets a plain JSON reply.
The one exception is the `Mcp-Session-Id` header on the `initialize` reply: it carries your
`clientInfo.name`, and sending it back on later requests is how the seller's stats show which
agent sent the buyer. MCP clients do all of this for you; the raw requests below are for testing and for building
your own client.

## Start and list the tools

```bash
curl -X POST https://one-thing-ash0.onrender.com/api/mcp \
  -H "content-type: application/json" \
  -d '{"jsonrpc":"2.0","id":0,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"my-agent","version":"1.0"}}}'

curl -X POST https://one-thing-ash0.onrender.com/api/mcp \
  -H "content-type: application/json" \
  -H "mcp-session-id: <the Mcp-Session-Id from initialize>" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

There are four tools:

1. `search_shops` finds live gallery shops by keywords (`query`, `limit`).
2. `get_product` describes one (`shop`), including any `options` the buyer must pick.
3. `create_order` puts one unit on order (`shop`, `options`) and returns `pay_url`. Nothing is charged yet.
4. `get_order` (`order_id`) reports where the order stands, and once it's paid, what the buyer got.

## Find and read

```bash
curl -X POST https://one-thing-ash0.onrender.com/api/mcp \
  -H "content-type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"search_shops","arguments":{"query":"skates"}}}'

curl -X POST https://one-thing-ash0.onrender.com/api/mcp \
  -H "content-type: application/json" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_product","arguments":{"shop":"vintageskates"}}}'
```

Every tool reply has the answer twice: as JSON text in `content` (for models) and as an object
in `structuredContent` (for code). The objects are the same as the plain GETs above.

## Order

```bash
curl -X POST https://one-thing-ash0.onrender.com/api/mcp \
  -H "content-type: application/json" \
  -d '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"create_order","arguments":{"shop":"vintageskates","options":{"Size":"9"}}}}'
```

`structuredContent`:

```json
{
  "order_id": "pX4kR9tVb2nQ7sLe",
  "status": "awaiting_buyer_approval",
  "total": "$255.00",
  "options": { "Size": "9" },
  "pay_url": "https://one-thing-ash0.onrender.com/o/pX4kR9tVb2nQ7sLe",
  "status_url": "https://one-thing-ash0.onrender.com/api/agent/orders/pX4kR9tVb2nQ7sLe",
  "next_step": "Show pay_url to the buyer as a link. It opens PayPal, where they pay (and enter a shipping address for physical items). When they say they've paid, call get_order with order_id: it returns the access code, download link or shipping details."
}
```

The price comes from the shop, never from the agent. Leave out `options` for a product without
them; a missing or sold-out pick comes back as a tool error (`isError: true`) the model can read.

## The pay link

`pay_url` is a link on OneThing (`/o/<order_id>`, see `openPayLink`) that redirects to PayPal.
PayPal's own approval URL carries a checkout token, and agent platforms hide tokens like that from
chat as secrets, so an agent could never show it. `pay_url` is safe to print: the token stays on
the server. Once the order is paid, the same link opens the thank-you page instead.

```bash
curl -i https://one-thing-ash0.onrender.com/o/pX4kR9tVb2nQ7sLe
```

```http
HTTP/1.1 303 See Other
location: https://www.sandbox.paypal.com/checkoutnow?token=…
```

## Check the order

An agent in a chat can't sit and poll. The rhythm that works: show `pay_url` as a link, wait for
the buyer to say they've paid, then call `get_order` once.

```bash
curl -X POST https://one-thing-ash0.onrender.com/api/mcp \
  -H "content-type: application/json" \
  -d '{"jsonrpc":"2.0","id":5,"method":"tools/call","params":{"name":"get_order","arguments":{"order_id":"pX4kR9tVb2nQ7sLe"}}}'
```

A paid physical order's `structuredContent`:

```json
{
  "order_id": "pX4kR9tVb2nQ7sLe",
  "status": "paid",
  "product": "Vintage Cream and Red Roller Skates",
  "options": { "Size": "9" },
  "amount": { "item": 240, "shipping": 15, "total": 255, "currency": "USD" },
  "total": "$255.00",
  "paid_at": "2026-10-22T02:41:37Z",
  "receipt_url": "https://one-thing-ash0.onrender.com/vintageskates/thanks?order=pX4kR9tVb2nQ7sLe",
  "delivery": {
    "type": "shipping",
    "ship_to": { "name": "Sam Rivera", "address": "1 Main St, Springfield, IL, 62701, US" },
    "fulfillment": "to_ship",
    "tracking": null
  }
}
```

`delivery` is one of:

| `type` | Fields |
|---|---|
| `access_code` | `access_code`, and `start_url` (the seller's app with the code filled in) |
| `download` | `download_url` (works 5 times over 14 days) |
| `shipping` | `ship_to`, `fulfillment` (`to_ship` or `shipped`), `tracking` once shipped |

When a payment doesn't go through, `status` says why and `next_step` says what to do:

| `status` | Meaning |
|---|---|
| `awaiting_buyer_approval` | Not paid yet. `pay_url` is included again. |
| `declined` | PayPal declined it; nothing charged. The buyer can open `pay_url` again. |
| `sold_out` | It sold out before the payment was captured; nothing charged. |
| `expired` | The PayPal checkout expired; call `create_order` for a new one. |
| `failed` | PayPal couldn't be reached; call `get_order` again. |

The seller sees these orders in `listOrders` with `channel: agent`.


# Testing in the sandbox

Pay with a **personal** sandbox account that doesn't receive the money. PayPal refuses the shop's
own account, and for a shop without its own PayPal set up, the money goes to the platform account,
so that one is refused too. See **Test in the PayPal sandbox**.



