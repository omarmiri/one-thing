# Json Rpc Response

Source: /#/typescript/x-redirect/JTI0bSUyRkpzb25ScGNSZXNwb25zZQ

A JSON-RPC 2.0 reply from the MCP server.


# Interface Name

`JsonRpcResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `jsonrpc` | `string` | Required, Constant | Always `2.0`.<br><br>**Value**: `'2.0'` |
| `id` | [`JsonRpcResponseId \| null`](/llms-pages/typescript/models/oneof-anyof-definitions/json-rpc-response-id.md) | Required | This is a container for one-of cases. |
| `result` | `unknown \| undefined` | Optional | For `tools/call`: `content` (the answer as JSON text), `structuredContent` (the same object) and `isError`. |
| `error` | [`Error \| undefined`](/llms-pages/typescript/models/structures/error.md) | Optional | Present when the call failed. |


# Example

```ts
import { JsonRpcResponse } from 'one-thing-sdk';

const jsonRpcResponse: JsonRpcResponse = {
  jsonrpc: '2.0',
  id: 1,
  result: { 'content': [{ 'type': 'text', 'text': '{ \\'shop\\':  \\'vintageskates\\' }' }], 'isError': false },
};
```



