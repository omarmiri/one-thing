# Call Mcp

Source: /#/typescript/x-redirect/JTI0ZSUyRkFnZW50cyUyRmNhbGxNY3A

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

```ts
async callMcp(
  body: CallMcpBody,
  requestOptions?: RequestOptions
): Promise<ApiResponse<CallMcpResponse>>
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `body` | [`CallMcpBody`](/llms-pages/typescript/models/oneof-anyof-definitions/call-mcp-body.md) | Body, Required | This is a container for one-of cases. |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: The JSON-RPC reply (an array for a batch).

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type `CallMcpResponse`.


# Example Usage

```ts
const body: CallMcpBody = {
  jsonrpc: '2.0',
  method: Method.EnumToolscall,
  id: 1,
  params: { 'name': 'search_shops', 'arguments': { 'query': 'game' } },
};

try {
  const response = await agentsApi.callMcp(body);

  // Extracting fully parsed response body.
  console.log(response.result);

  // Extracting response status code.
  console.log(response.statusCode);
  // Extracting response headers.
  console.log(response.headers);
  // Extracting response body of type `string | Stream`
  console.log(response.body);
} catch (error) {
  if (error instanceof ApiError) {
    // Extracting response error status code.
    console.log(error.statusCode);
    // Extracting response error headers.
    console.log(error.headers);
    // Extracting response error body of type `string | Stream`.
    console.log(error.body);
    if (error instanceof JsonRpcResponseError) {
      console.log(error.result);
    }
  }
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Not JSON (JSON-RPC parse error `-32700`). | [`JsonRpcResponseError`](/llms-pages/typescript/models/exceptions/json-rpc-response-error.md) |



