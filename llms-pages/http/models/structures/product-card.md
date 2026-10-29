# Product Card

Source: /#/http/x-redirect/JTI0bSUyRlByb2R1Y3RDYXJk

A Channel3 product in search results.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `String` | Required | Channel3's product id: pass it to `createShop` as `productId`. |
| `title` | `String` | Required | The product's name. |
| `brand` | `String` | Optional | The brand, when known. |
| `image` | `String` | Required | The product image's URL. |
| `price` | `Decimal` | Required | The best offer's price. |
| `currency` | `String` | Required | ISO 4217 currency code. |
| `retailer` | `String` | Required | The store with the best offer. |
| `retailers` | `Number` | Required | How many stores sell it. |
| `commission` | `Decimal` | Required | Best commission rate across offers, 0–1. |


# Example (as JSON)

```json
{
  "id": "ch3_7f2a9c1e",
  "title": "Trail Running Vest 5L",
  "brand": "Salomon",
  "image": "https://images.example.com/vest.jpg",
  "price": 240,
  "currency": "USD",
  "retailer": "rei.com",
  "retailers": 4,
  "commission": 0.08
}
```



