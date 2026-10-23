# Call Mcp

Source: /#/http/x-redirect/JTI0ZSUyRkFnZW50cyUyRmNhbGxNY3A

A [Model Context Protocol](https://modelcontextprotocol.io) server, so agents such as
Claude can shop here. Add `https://<host>/api/mcp` to an MCP client as a Streamable HTTP
server. It's stateless: each POST carries one JSON-RPC 2.0 message (or a batch) and gets a
plain JSON reply, with no session and no event stream.

Methods: `initialize`, `ping`, `tools/list`, `tools/call`. Tools:

| Tool | Arguments | What it does |
|---|---|---|
| `search_shops` | `query?`, `limit?` (1–25) | Live gallery shops whose name or headline has every word |
| `get_product` | `shop` | The same object as `getAgentProduct` |
| `create_order` | `shop`, `options?` | One unit on order; returns `order_id` and `pay_url` |
| `get_order` | `order_id` | Status and `next_step`; once paid, the receipt and `delivery` |

**The buyer always approves.** `create_order` charges nothing: the agent shows the buyer
`pay_url` (`/o/<order_id>`, see `openPayLink`), which opens PayPal. It's a plain link on this
site, so agent platforms that hide PayPal's checkout tokens can still show it. When the buyer
says they've paid, the agent calls `get_order`.

`get_order` status is one of `awaiting_buyer_approval`, `paid`, `declined` (nothing charged;
the buyer can open `pay_url` again), `sold_out`, `expired` (call `create_order` again) or
`failed` (PayPal couldn't be reached; try again), with a `next_step` the agent can follow.
A paid order carries `delivery`: `{type: access_code, access_code, start_url?}`,
`{type: download, download_url}` or `{type: shipping, ship_to, fulfillment, tracking}`, plus
`amount` with item, shipping and total. Orders made this way show `channel: agent` in
`listOrders`.

Tool errors (an unknown shop, a sold-out size) come back as results with `isError: true`,
so the model can read them and try something else.

:information_source: **Note** This endpoint does not require authentication.

```http
POST /api/mcp
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `body` | [`Json Rpc Request \| array<Json Rpc Request>`](/llms-pages/http/models/oneof-anyof-definitions/call-mcp-body.md) | Body, Required | - |


# Response Type

**200**: The JSON-RPC reply (an array for a batch).

**202**: Only notifications were sent; there's nothing to reply.

[`Json Rpc Response | array<Json Rpc Response>`](/llms-pages/http/models/oneof-anyof-definitions/call-mcp-response.md)


# Example Usage

```bash
curl -X POST \
  --url 'https://one-thing-ash0.onrender.com/api/mcp'  \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  --data-raw '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "search_shops",
    "arguments": {
      "query": "game"
    }
  }
}'
```


# Example Response

```
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\n  \"shops\": [\n    {\n      \"shop\": \"vintageskates\",\n      \"name\": \"Vintage Cream and Red Roller Skates\",\n      \"kind\": \"physical\",\n      \"headline\": \"Classic quad skates crafted with walnut burl heels\",\n      \"price\": \"$240.00\",\n      \"url\": \"https://one-thing-ash0.onrender.com/vintageskates\"\n    },\n    {\n      \"shop\": \"raptorrush\",\n      \"name\": \"Raptor Rush: Browser Edition\",\n      \"kind\": \"digital\",\n      \"headline\": \"Grow from Tiny Hatchling to Giant Apex Predator\",\n      \"price\": \"$2.99\",\n      \"url\": \"https://one-thing-ash0.onrender.com/raptorrush\"\n    }\n  ]\n}"
      }
    ],
    "structuredContent": {
      "shops": [
        {
          "shop": "vintageskates",
          "name": "Vintage Cream and Red Roller Skates",
          "kind": "physical",
          "headline": "Classic quad skates crafted with walnut burl heels",
          "price": "$240.00",
          "url": "https://one-thing-ash0.onrender.com/vintageskates"
        },
        {
          "shop": "raptorrush",
          "name": "Raptor Rush: Browser Edition",
          "kind": "digital",
          "headline": "Grow from Tiny Hatchling to Giant Apex Predator",
          "price": "$2.99",
          "url": "https://one-thing-ash0.onrender.com/raptorrush"
        }
      ]
    },
    "isError": false
  }
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Not JSON (JSON-RPC parse error `-32700`). | [`JsonRpcResponse_ErrorException`](/llms-pages/http/models/exceptions/json-rpc-response-error.md) |



