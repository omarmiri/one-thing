# Shop

Source: /#/http/x-redirect/JTI0bSUyRlNob3A


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `String` | Required | - |
| `slug` | `String` | Required | - |
| `status` | [`Status`](/llms-pages/http/models/enumerations/status.md) | Required | - |
| `product_type` | [`Product Type 1`](/llms-pages/http/models/enumerations/product-type-1.md) | Required | - |
| `price_cents` | `Number` | Required | - |
| `currency` | `String` | Required | - |
| `shipping_cents` | `Number` | Optional | - |
| `ship_countries` | `String` | Optional | - |
| `stock` | `Number` | Optional | - |
| `delivery` | [`Delivery 1`](/llms-pages/http/models/enumerations/delivery-1.md) | Optional | - |
| `access_url` | `String` | Optional | - |
| `paypal_email` | `String` | Optional | - |
| `seller_email` | `String` | Optional | - |
| `zapier_hook_url` | `String` | Optional | - |
| `in_gallery` | `Boolean` | Optional | - |
| `photo_blob` | `String` | Optional | Image id for `getImage`. |
| `hero_blob` | `String` | Optional | - |
| `hero_status` | [`Hero Status`](/llms-pages/http/models/enumerations/hero-status.md) | Optional | - |
| `hero_error` | `String` | Optional | - |
| `ai_source` | [`Ai Source`](/llms-pages/http/models/enumerations/ai-source.md) | Optional | - |
| `source_url` | `String` | Optional | - |
| `referral` | [`Referral`](/llms-pages/http/models/oneof-anyof-definitions/shop-referral.md) | Optional | - |
| `spec` | [`Design Spec`](/llms-pages/http/models/structures/design-spec.md) | Required | What Gemini designed. OneThing's templates render it; Gemini never writes HTML. |
| `created_at` | `DateTime` | Optional | - |


# Example (as JSON)

```json
{
  "id": "id4",
  "slug": "slug8",
  "status": "draft",
  "product_type": "physical",
  "price_cents": 220,
  "currency": "USD",
  "spec": {
    "productType": "digital",
    "productName": "productName2",
    "layout": "minimal",
    "palette": {
      "background": "#14171a",
      "surface": "#14171a",
      "text": "#14171a",
      "muted": "#14171a",
      "accent": "#14171a",
      "accentText": "#14171a"
    },
    "fonts": {
      "heading": "heading2",
      "body": "body6"
    },
    "headline": "headline2",
    "bullets": [
      "bullets0",
      "bullets1",
      "bullets2"
    ],
    "faq": [
      {
        "q": "q0",
        "a": "a8"
      }
    ],
    "ctaLabel": "ctaLabel6",
    "eyebrow": "eyebrow6",
    "subheadline": "subheadline8",
    "story": "story6",
    "details": [
      {
        "label": "label0",
        "value": "value2"
      },
      {
        "label": "label0",
        "value": "value2"
      },
      {
        "label": "label0",
        "value": "value2"
      }
    ],
    "suggestedPriceUsd": 233.64
  },
  "shipping_cents": 200,
  "ship_countries": "ship_countries8",
  "stock": 226,
  "delivery": "file",
  "access_url": "access_url4"
}
```



