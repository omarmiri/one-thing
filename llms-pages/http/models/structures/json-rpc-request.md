# Json Rpc Request

Source: /#/http/x-redirect/JTI0bSUyRkpzb25ScGNSZXF1ZXN0


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `jsonrpc` | `String` | Required, Constant | **Value**: `2.0` |
| `id` | [`String \| Number`](/llms-pages/http/models/oneof-anyof-definitions/json-rpc-request-id.md) | Optional | Leave out for a notification. |
| `method` | [`Method`](/llms-pages/http/models/enumerations/method.md) | Required | - |
| `params` | `Object` | Optional | For `tools/call`: `{ name, arguments }`. |


# Example (as JSON)

```json
{
  "jsonrpc": "2.0",
  "method": "tools/list",
  "id": "String5",
  "params": {
    "key1": "val1",
    "key2": "val2"
  }
}
```



