# Variant

Source: /#/http/x-redirect/JTI0bSUyRlZhcmlhbnQ


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `choice` | `map<String>` | Required | The buyer's pick, one value per option, keyed by option name. |
| `availability` | `String` | Required | - |
| `order_url` | `String` | Optional | `orderByLink` for this pick. Left out when it's sold out. |


# Example (as JSON)

```json
{
  "choice": {
    "Size": "M",
    "Color": "Black"
  },
  "availability": "availability0",
  "order_url": "order_url6"
}
```



