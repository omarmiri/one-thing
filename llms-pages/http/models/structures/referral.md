# Referral

Source: /#/http/x-redirect/JTI0bSUyRlJlZmVycmFs

A recommended Channel3 product. Buy links are Channel3-tracked, credited to this shop.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `productId` | `String` | Required | Channel3's product id. |
| `title` | `String` | Required | The product's name. |
| `brand` | `String` | Optional | The brand, when known. |
| `image` | `String` | Optional | The product image's URL. |
| `offers` | [`array<Offer>`](/llms-pages/http/models/structures/offer.md) | Required | Stores that sell it, with tracked links. |


# Example (as JSON)

```json
{
  "productId": "ch3_7f2a9c1e",
  "title": "Trail Running Vest 5L",
  "brand": "Salomon",
  "image": "https://images.example.com/vest.jpg",
  "offers": [
    {
      "domain": "rei.com",
      "url": "https://buy.trychannel3.com/r/abc123",
      "price": 240,
      "currency": "USD",
      "inStock": true,
      "commission": 0.08
    }
  ]
}
```



