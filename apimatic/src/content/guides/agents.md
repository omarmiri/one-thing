# Let AI agents buy

Every live shop is agent-ready. An AI shopping agent can find it, read the product and place an
order, and the buyer approves the payment at PayPal. No agent can spend someone's money on its own.

## What agents can read

- **Product JSON:** `getAgentProduct` (`/api/agent/shops/<slug>`) gives price, shipping, delivery,
  availability, sizes and colours, images and FAQ.
- **The shop page:** every shop page carries the same facts as schema.org `Product` JSON-LD, so
  agents that browse rather than call APIs see them too.

## The MCP server

Add `https://one-thing-ash0.onrender.com/api/mcp` to any MCP client as a Streamable HTTP server.
For Claude Code:

```bash
claude mcp add --transport http onething https://one-thing-ash0.onrender.com/api/mcp
```

It has four tools:

1. `search_shops` finds live shops by keywords.
2. `get_product` describes one, including any `options` the buyer must pick.
3. `create_order` puts one unit on order and returns `approve_url`. Nothing is charged yet.
4. `get_order` reports `awaiting_buyer_approval` until the buyer pays at `approve_url`, then
   `paid` with the receipt link (download link or access code for digital products).

A sold-out size or an unknown shop comes back as a tool error the model can read, so it can pick
something else. The seller sees these orders in `listOrders` with `channel: agent`.
