# Json Rpc Request

Source: /#/typescript/x-redirect/JTI0bSUyRkpzb25ScGNSZXF1ZXN0


# Interface Name

`JsonRpcRequest`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `jsonrpc` | `string` | Required, Constant | **Value**: `'2.0'` |
| `id` | [`JsonRpcRequestId \| null \| undefined`](/llms-pages/typescript/models/oneof-anyof-definitions/json-rpc-request-id.md) | Optional | This is a container for one-of cases. |
| `method` | [`Method`](/llms-pages/typescript/models/enumerations/method.md) | Required | - |
| `params` | `unknown \| undefined` | Optional | For `tools/call`: `{ name, arguments }`. |


# Example

```ts
import { JsonRpcRequest, Method } from 'one-thing-sdk';

const jsonRpcRequest: JsonRpcRequest = {
  jsonrpc: '2.0',
  method: Method.EnumNotificationsinitialized,
  id: 'String1',
  params: { 'key1': 'val1', 'key2': 'val2' },
};
```



