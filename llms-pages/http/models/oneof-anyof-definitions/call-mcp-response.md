# Call Mcp Response

Source: /#/http/x-redirect/JTI0bSUyRkNhbGxNY3BSZXNwb25zZQ


# Data Type

`Json Rpc Response | array<Json Rpc Response>`


# Cases

| Type |
|  --- |
| [`Json Rpc Response`](/llms-pages/http/models/structures/json-rpc-response.md) |
| [`array<Json Rpc Response>`](/llms-pages/http/models/structures/json-rpc-response.md) |


# Json Rpc Response

## Initialization Code

### Example

```bash
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"shop\": \"vintageskates\"}"
      }
    ],
    "isError": false
  }
}
```


# array<Json Rpc Response>

## Initialization Code

### Example

```bash
[
  {
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
      "content": [
        {
          "type": "text",
          "text": "{\"shop\": \"vintageskates\"}"
        }
      ],
      "isError": false
    }
  }
]
```



