# Offer 1

Source: /#/http/x-redirect/JTI0bSUyRk9mZmVyMQ

One store's offer.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `retailer` | `String` | Required | The store. |
| `price` | `Decimal` | Required | The store's price. |
| `currency` | `String` | Required | ISO 4217 currency code. |
| `in_stock` | `Boolean` | Required | Whether the store has it in stock. |
| `url` | `String` | Required | A tracked buy link at that store. |


# Example (as JSON)

```json
{
  "retailer": "rei.com",
  "price": 240,
  "currency": "USD",
  "in_stock": true,
  "url": "https://buy.trychannel3.com/r/abc123"
}
```



