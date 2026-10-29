# Api Channel 3 Search Response

Source: /#/http/x-redirect/JTI0bSUyRkFwaSUyNTIwQ2hhbm5lbDMlMjUyMFNlYXJjaCUyNTIwUmVzcG9uc2U

The products found.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `products` | [`array<Product Card>`](/llms-pages/http/models/structures/product-card.md) | Required | Products, best match first. |


# Example (as JSON)

```json
{
  "products": [
    {
      "id": "ch3_7f2a9c1e",
      "title": "Trail Running Vest 5L",
      "brand": "Salomon",
      "image": "https://images.example.com/vest.jpg",
      "price": 240.0,
      "currency": "USD",
      "retailer": "rei.com",
      "retailers": 4,
      "commission": 0.08
    }
  ]
}
```



