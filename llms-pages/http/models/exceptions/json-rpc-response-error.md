# Json Rpc Response Error

Source: /#/http/x-redirect/JTI0bSUyRkpzb25ScGNSZXNwb25zZV9FcnJvcg

A JSON-RPC 2.0 reply from the MCP server.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `jsonrpc` | `String` | Required, Constant | Always `2.0`.<br><br>**Value**: `2.0` |
| `id` | [`String \| Number`](/llms-pages/http/models/oneof-anyof-definitions/json-rpc-response-error-id.md) | Required | The request's `id`. |
| `result` | `Object` | Optional | For `tools/call`: `content` (the answer as JSON text), `structuredContent` (the same object) and `isError`. |
| `error` | [`Error`](/llms-pages/http/models/structures/error.md) | Optional | Present when the call failed. |



