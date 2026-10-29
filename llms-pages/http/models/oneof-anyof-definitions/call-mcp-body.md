# Call Mcp Body

Source: /#/http/x-redirect/JTI0bSUyRkNhbGxNY3BCb2R5


# Data Type

`Json Rpc Request | array<Json Rpc Request>`


# Cases

| Type |
|  --- |
| [`Json Rpc Request`](/llms-pages/http/models/structures/json-rpc-request.md) |
| [`array<Json Rpc Request>`](/llms-pages/http/models/structures/json-rpc-request.md) |


# Json Rpc Request

## Initialization Code

### Example

```bash
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


# array<Json Rpc Request>

## Initialization Code

### Example

```bash
[
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
]
```



