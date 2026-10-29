# Variant

Source: /#/http/x-redirect/JTI0bSUyRlZhcmlhbnQ

One combination of option values.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `choice` | `map<String>` | Required | The buyer's pick, one value per option, keyed by option name. |
| `availability` | `String` | Required | `in_stock`, `in_stock (N left)` or `sold_out`. |
| `order_url` | `String` | Optional | `orderByLink` for this pick. Left out when it's sold out. |


# Example (as JSON)

```json
{
  "choice": {
    "Size": "M",
    "Color": "Black"
  },
  "availability": "in_stock (3 left)",
  "order_url": "https://one-thing-ash0.onrender.com/vintageskates/buy?Size=9"
}
```



