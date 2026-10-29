# Json Rpc Request

Source: /#/typescript/x-redirect/JTI0bSUyRkpzb25ScGNSZXF1ZXN0

A JSON-RPC 2.0 request to the MCP server.


# Interface Name

`JsonRpcRequest`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `jsonrpc` | `string` | Required, Constant | Always `2.0`.<br><br>**Value**: `'2.0'` |
| `id` | [`JsonRpcRequestId \| null \| undefined`](/llms-pages/typescript/models/oneof-anyof-definitions/json-rpc-request-id.md) | Optional | This is a container for one-of cases. |
| `method` | [`Method`](/llms-pages/typescript/models/enumerations/method.md) | Required | The MCP method. `tools/call` runs a tool; `tools/list` lists them. |
| `params` | `unknown \| undefined` | Optional | For `tools/call`: `{ name, arguments }`. |


# Example

```ts
import { JsonRpcRequest, Method } from 'one-thing-sdk';

const jsonRpcRequest: JsonRpcRequest = {
  jsonrpc: '2.0',
  method: Method.EnumToolscall,
  id: 1,
  params: { 'name': 'get_product', 'arguments': { 'shop': 'vintageskates' } },
};
```



