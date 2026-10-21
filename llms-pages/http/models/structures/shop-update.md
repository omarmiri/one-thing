# Shop Update

Source: /#/http/x-redirect/JTI0bSUyRlNob3BVcGRhdGU


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Optional | - |
| `status` | [`Status`](/llms-pages/http/models/enumerations/status.md) | Optional | - |
| `product_type` | [`Product Type`](/llms-pages/http/models/enumerations/product-type.md) | Optional | `referral` only for shops created from Channel3. |
| `price` | `Decimal` | Optional | **Constraints**: `>= 0.5`, `<= 10000` |
| `shipping` | `Decimal` | Optional | **Constraints**: `>= 0`, `<= 500` |
| `stock` | `Number` | Optional | **Constraints**: `>= 0` |
| `ship_countries` | `String` | Optional | - |
| `delivery` | [`Delivery 1`](/llms-pages/http/models/enumerations/delivery-1.md) | Optional | - |
| `access_url` | `String` | Optional | - |
| `paypal_email` | `String` | Optional | - |
| `seller_email` | `String` | Optional | - |
| `zapier_hook_url` | `String` | Optional | - |
| `in_gallery` | `Boolean` | Optional | Feature the shop at `/gallery` while it's live. Off by default. |


# Example (as JSON)

```json
{
  "slug": "slug8",
  "status": "draft",
  "product_type": "physical",
  "price": 133.24,
  "shipping": 244.22
}
```



