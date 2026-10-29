# Json Rpc Request

Source: /#/http/x-redirect/JTI0bSUyRkpzb25ScGNSZXF1ZXN0

A JSON-RPC 2.0 request to the MCP server.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `jsonrpc` | `String` | Required, Constant | Always `2.0`.<br><br>**Value**: `2.0` |
| `id` | [`String \| Number`](/llms-pages/http/models/oneof-anyof-definitions/json-rpc-request-id.md) | Optional | Leave out for a notification. |
| `method` | [`Method`](/llms-pages/http/models/enumerations/method.md) | Required | The MCP method. `tools/call` runs a tool; `tools/list` lists them. |
| `params` | `Object` | Optional | For `tools/call`: `{ name, arguments }`. |


# Example (as JSON)

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "get_product",
    "arguments": {
      "shop": "vintageskates"
    }
  }
}
```



