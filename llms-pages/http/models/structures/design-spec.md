# Design Spec

Source: /#/http/x-redirect/JTI0bSUyRkRlc2lnblNwZWM

What Gemini designed. OneThing's templates render it; Gemini never writes HTML.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `productType` | [`Product Type 2`](/llms-pages/http/models/enumerations/product-type-2.md) | Required | - |
| `productName` | `String` | Required | - |
| `layout` | [`Layout`](/llms-pages/http/models/enumerations/layout.md) | Required | - |
| `palette` | [`Palette`](/llms-pages/http/models/structures/palette.md) | Required | - |
| `fonts` | [`Fonts`](/llms-pages/http/models/structures/fonts.md) | Required | - |
| `eyebrow` | `String` | Optional | - |
| `headline` | `String` | Required | - |
| `subheadline` | `String` | Optional | - |
| `story` | `String` | Optional | - |
| `bullets` | `array<String>` | Required | - |
| `details` | [`array<Detail>`](/llms-pages/http/models/structures/detail.md) | Optional | - |
| `faq` | [`array<Faq>`](/llms-pages/http/models/structures/faq.md) | Required | - |
| `ctaLabel` | `String` | Required | - |
| `suggestedPriceUsd` | `Decimal` | Optional | - |
| `suggestedShippingUsd` | `Decimal` | Optional | - |
| `imageAlt` | `String` | Optional | - |
| `heroPrompt` | `String` | Optional | - |


# Example (as JSON)

```json
{
  "productType": "digital",
  "productName": "productName0",
  "layout": "bold-hero",
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
  "headline": "headline0",
  "bullets": [
    "bullets8",
    "bullets9",
    "bullets0"
  ],
  "faq": [
    {
      "q": "q0",
      "a": "a8"
    }
  ],
  "ctaLabel": "ctaLabel4",
  "eyebrow": "eyebrow4",
  "subheadline": "subheadline6",
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
  "suggestedPriceUsd": 68.62
}
```



