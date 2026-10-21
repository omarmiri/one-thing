# Product Card

Source: /#/http/x-redirect/JTI0bSUyRlByb2R1Y3RDYXJk


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `String` | Required | - |
| `title` | `String` | Required | - |
| `brand` | `String` | Optional | - |
| `image` | `String` | Required | - |
| `price` | `Decimal` | Required | - |
| `currency` | `String` | Required | - |
| `retailer` | `String` | Required | The store with the best offer. |
| `retailers` | `Number` | Required | - |
| `commission` | `Decimal` | Required | Best commission rate across offers, 0–1. |


# Example (as JSON)

```json
{
  "id": "id4",
  "title": "title0",
  "brand": "brand8",
  "image": "image2",
  "price": 167.98,
  "currency": "currency4",
  "retailer": "retailer4",
  "retailers": 130,
  "commission": 36.32
}
```



