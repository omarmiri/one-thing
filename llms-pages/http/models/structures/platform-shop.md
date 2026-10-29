# Platform Shop

Source: /#/http/x-redirect/JTI0bSUyRlBsYXRmb3JtU2hvcA

A shop as a platform API key lists it.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Required | The shop's link name. |
| `status` | [`Status 3`](/llms-pages/http/models/enumerations/status-3.md) | Required | `draft` until the seller goes live. |
| `name` | `String` | Required | The product's name. |
| `headline` | `String` | Optional | The shop's one-line pitch. |
| `product_type` | [`Product Type 3`](/llms-pages/http/models/enumerations/product-type-3.md) | Required | `physical`, `digital` or `referral`. |
| `price` | [`Agent Money`](/llms-pages/http/models/structures/agent-money.md) | Required | An amount of money, as a number and as a label. |
| `url` | `String` | Required | The shop page buyers pay on. |
| `cover` | `String` | Optional | The cover image's URL. |
| `paypal_connected` | `Boolean` | Required | The seller connected a PayPal account that can be paid. |
| `sales` | `Number` | Required | Paid orders. |
| `created_at` | `DateTime` | Required | When the shop was made. |


# Example (as JSON)

```json
{
  "slug": "vintageskates",
  "status": "draft",
  "name": "Vintage Cream and Red Roller Skates",
  "headline": "Classic quad skates crafted with walnut burl heels",
  "product_type": "physical",
  "price": {
    "amount": 240,
    "currency": "USD",
    "label": "$240.00"
  },
  "url": "https://one-thing-ash0.onrender.com/vintageskates",
  "cover": "https://one-thing-ash0.onrender.com/api/blobs/LFRvGuTU3D8i334X",
  "paypal_connected": true,
  "sales": 12,
  "created_at": "2026-10-22T02:41:37Z"
}
```



