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
| `create_order` | `shop`, `options?` | One unit on order; returns `order_id` and `approve_url` |
| `get_order` | `order_id` | `awaiting_buyer_approval` or `paid`, with the receipt link once paid |

**The buyer always approves.** `create_order` charges nothing: the agent gives the buyer
`approve_url`, they pay at PayPal, and the agent polls `get_order`. Orders made this way
show `channel: agent` in `listOrders`.

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


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Not JSON (JSON-RPC parse error `-32700`). | [`JsonRpcResponse_ErrorException`](/llms-pages/http/models/exceptions/json-rpc-response-error.md) |



