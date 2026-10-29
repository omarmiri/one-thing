# Agent Money

Source: /#/http/x-redirect/JTI0bSUyRkFnZW50TW9uZXk

An amount of money, as a number and as a label.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `amount` | `Decimal` | Required | The amount in the currency's main unit (dollars, not cents). |
| `currency` | `String` | Required | ISO 4217 currency code. |
| `label` | `String` | Optional | The amount formatted for people. |


# Example (as JSON)

```json
{
  "amount": 240,
  "currency": "USD",
  "label": "$240.00"
}
```



