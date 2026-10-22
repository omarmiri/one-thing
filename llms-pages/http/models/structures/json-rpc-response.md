# Json Rpc Response

Source: /#/http/x-redirect/JTI0bSUyRkpzb25ScGNSZXNwb25zZQ


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `jsonrpc` | `String` | Required, Constant | **Value**: `2.0` |
| `id` | [`String \| Number`](/llms-pages/http/models/oneof-anyof-definitions/json-rpc-response-id.md) | Required | - |
| `result` | `Object` | Optional | For `tools/call`: `content` (the answer as JSON text), `structuredContent` (the same object) and `isError`. |
| `error` | [`Error 1`](/llms-pages/http/models/structures/error-1.md) | Optional | - |


# Example (as JSON)

```json
{
  "jsonrpc": "2.0",
  "id": "String9",
  "result": {
    "key1": "val1",
    "key2": "val2"
  },
  "error": {
    "code": 24,
    "message": "message4"
  }
}
```



