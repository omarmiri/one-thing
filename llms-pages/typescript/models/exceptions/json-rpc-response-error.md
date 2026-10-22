# Json Rpc Response Error

Source: /#/typescript/x-redirect/JTI0bSUyRkpzb25ScGNSZXNwb25zZV9FcnJvcg


# Class Name

`JsonRpcResponseError`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `jsonrpc` | `string` | Required, Constant | **Value**: `'2.0'` |
| `id` | [`JsonRpcResponseErrorId \| null`](/llms-pages/typescript/models/oneof-anyof-definitions/json-rpc-response-error-id.md) | Required | This is a container for one-of cases. |
| `result` | `unknown \| undefined` | Optional | For `tools/call`: `content` (the answer as JSON text), `structuredContent` (the same object) and `isError`. |
| `error` | [`Error1 \| undefined`](/llms-pages/typescript/models/structures/error-1.md) | Optional | - |


# Example

```ts
try {
  // make the API call
} catch (error) {
  if (error instanceof JsonRpcResponseError) {
    console.log(error.result);
  }
}
```



