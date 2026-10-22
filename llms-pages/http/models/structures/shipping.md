# Shipping

Source: /#/http/x-redirect/JTI0bSUyRlNoaXBwaW5n


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `amount` | `Decimal` | Required | - |
| `currency` | `String` | Required | - |
| `ships_to` | `array<String>` | Required | Country codes; empty means anywhere PayPal ships. |


# Example (as JSON)

```json
{
  "amount": 194.54,
  "currency": "currency2",
  "ships_to": [
    "ships_to5",
    "ships_to6",
    "ships_to7"
  ]
}
```



