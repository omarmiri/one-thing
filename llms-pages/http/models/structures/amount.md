# Amount

Source: /#/http/x-redirect/JTI0bSUyRkFtb3VudA

What the order costs, as numbers.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `item` | `Decimal` | Required | The product's price. |
| `shipping` | `Decimal` | Required | Shipping; 0 for digital products. |
| `total` | `Decimal` | Required | Product plus shipping: what the buyer pays. |
| `currency` | `String` | Required | ISO 4217 currency code. |


# Example (as JSON)

```json
{
  "item": 240,
  "shipping": 15,
  "total": 255,
  "currency": "USD"
}
```



