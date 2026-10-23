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
3. `create_order` puts one unit on order and returns `pay_url`. Nothing is charged yet.
4. `get_order` reports `awaiting_buyer_approval` until the buyer pays, then `paid` with what they
   bought in `delivery`: the access code, the download link, or the shipping address and tracking.

`pay_url` is a link on OneThing (`/o/<order_id>`) that redirects to PayPal. PayPal's own approval
URL carries a checkout token, and agent platforms hide tokens like that from chat as secrets, so
the agent could never show it. `pay_url` is safe to print: the token stays on the server.

An agent in a chat can't sit and poll. The rhythm that works: show `pay_url` as a link, wait for
the buyer to say they've paid, then call `get_order` once.

When a payment doesn't go through, `get_order` says why and what to do next (`next_step`):

| Status | Meaning |
|---|---|
| `declined` | PayPal declined it; nothing charged. The buyer can open `pay_url` again. |
| `sold_out` | It sold out before the payment was captured; nothing charged. |
| `expired` | The PayPal checkout expired; call `create_order` for a new one. |
| `failed` | PayPal couldn't be reached; call `get_order` again. |

A sold-out size or an unknown shop comes back as a tool error the model can read, so it can pick
something else. The seller sees these orders in `listOrders` with `channel: agent`.
