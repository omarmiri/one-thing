# Offer

Source: /#/http/x-redirect/JTI0bSUyRk9mZmVy

One store's offer.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `domain` | `String` | Required | The store's domain. |
| `url` | `String` | Required | A Channel3-tracked buy link, credited to this shop. |
| `price` | `Decimal` | Required | The store's price. |
| `currency` | `String` | Required | ISO 4217 currency code. |
| `inStock` | `Boolean` | Required | Whether the store has it in stock. |
| `commission` | `Decimal` | Required | Maximum commission rate, 0–1 (0.08 = 8%). |


# Example (as JSON)

```json
{
  "domain": "rei.com",
  "url": "https://buy.trychannel3.com/r/abc123",
  "price": 240,
  "currency": "USD",
  "inStock": true,
  "commission": 0.08
}
```



