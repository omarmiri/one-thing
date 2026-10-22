# Json Rpc Response

Source: /#/typescript/x-redirect/JTI0bSUyRkpzb25ScGNSZXNwb25zZQ


# Interface Name

`JsonRpcResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `jsonrpc` | `string` | Required, Constant | **Value**: `'2.0'` |
| `id` | [`JsonRpcResponseId \| null`](/llms-pages/typescript/models/oneof-anyof-definitions/json-rpc-response-id.md) | Required | This is a container for one-of cases. |
| `result` | `unknown \| undefined` | Optional | For `tools/call`: `content` (the answer as JSON text), `structuredContent` (the same object) and `isError`. |
| `error` | [`Error1 \| undefined`](/llms-pages/typescript/models/structures/error-1.md) | Optional | - |


# Example

```ts
import { JsonRpcResponse } from 'one-thing-sdk';

const jsonRpcResponse: JsonRpcResponse = {
  jsonrpc: '2.0',
  id: 'String3',
  result: { 'key1': 'val1', 'key2': 'val2' },
  error: {
    code: 24,
    message: 'message4',
  },
};
```



