# Referral

Source: /#/http/x-redirect/JTI0bSUyRlJlZmVycmFs

A recommended Channel3 product. Buy links are Channel3-tracked, credited to this shop.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `productId` | `String` | Required | - |
| `title` | `String` | Required | - |
| `brand` | `String` | Optional | - |
| `image` | `String` | Optional | - |
| `offers` | [`array<Offer>`](/llms-pages/http/models/structures/offer.md) | Required | - |


# Example (as JSON)

```json
{
  "productId": "productId0",
  "title": "title2",
  "offers": [
    {
      "domain": "domain0",
      "url": "url8",
      "price": 134.28,
      "currency": "currency4",
      "inStock": false,
      "commission": 2.62
    }
  ],
  "brand": "brand0",
  "image": "image0"
}
```



