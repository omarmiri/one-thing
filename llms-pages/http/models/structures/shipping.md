# Shipping

Source: /#/http/x-redirect/JTI0bSUyRlNoaXBwaW5n

Shipping cost and destinations.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `amount` | `Decimal` | Required | Shipping cost per order. |
| `currency` | `String` | Required | ISO 4217 currency code. |
| `ships_to` | `array<String>` | Required | Country codes; empty means anywhere PayPal ships. |


# Example (as JSON)

```json
{
  "amount": 15,
  "currency": "USD",
  "ships_to": [
    "US",
    "CA"
  ]
}
```



