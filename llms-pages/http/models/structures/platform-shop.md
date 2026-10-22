# Platform Shop

Source: /#/http/x-redirect/JTI0bSUyRlBsYXRmb3JtU2hvcA


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Required | - |
| `status` | [`Status`](/llms-pages/http/models/enumerations/status.md) | Required | - |
| `name` | `String` | Required | - |
| `headline` | `String` | Optional | - |
| `product_type` | [`Product Type 1`](/llms-pages/http/models/enumerations/product-type-1.md) | Required | - |
| `price` | [`Agent Money`](/llms-pages/http/models/structures/agent-money.md) | Required | - |
| `url` | `String` | Required | The shop page buyers pay on. |
| `cover` | `String` | Optional | The cover image's URL. |
| `paypal_connected` | `Boolean` | Required | The seller connected a PayPal account that can be paid. |
| `sales` | `Number` | Required | Paid orders. |
| `created_at` | `DateTime` | Required | - |


# Example (as JSON)

```json
{
  "slug": "slug6",
  "status": "draft",
  "name": "name0",
  "product_type": "digital",
  "price": {
    "amount": 48.5,
    "currency": "USD",
    "label": "$48.50"
  },
  "url": "url4",
  "paypal_connected": false,
  "sales": 224,
  "created_at": "2016-03-13T12:52:32.123Z",
  "headline": "headline0",
  "cover": "cover4"
}
```



