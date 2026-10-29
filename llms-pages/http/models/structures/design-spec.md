# Design Spec

Source: /#/http/x-redirect/JTI0bSUyRkRlc2lnblNwZWM

What Gemini designed. OneThing's templates render it; Gemini never writes HTML.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `productType` | [`Product Type 2`](/llms-pages/http/models/enumerations/product-type-2.md) | Required | What the AI decided the product is. |
| `productName` | `String` | Required | The product's name. |
| `layout` | [`Layout`](/llms-pages/http/models/enumerations/layout.md) | Required | The page template: `bold-hero` (image first, punchy), `editorial` (magazine), `minimal` (quiet, lots of space) or `playful`. |
| `palette` | [`Palette`](/llms-pages/http/models/structures/palette.md) | Required | The page colours, taken from the photo. Text colours are checked for contrast. |
| `fonts` | [`Fonts`](/llms-pages/http/models/structures/fonts.md) | Required | Google Fonts for the page. |
| `eyebrow` | `String` | Optional | A short label above the headline. |
| `headline` | `String` | Required | The page's main headline. |
| `subheadline` | `String` | Optional | A line under the headline. |
| `story` | `String` | Optional | A short paragraph about the product. |
| `bullets` | `array<String>` | Required | Short selling points. |
| `details` | [`array<Detail>`](/llms-pages/http/models/structures/detail.md) | Optional | Product facts shown on the page. |
| `faq` | [`array<Faq>`](/llms-pages/http/models/structures/faq.md) | Required | Questions buyers will ask, with answers. |
| `ctaLabel` | `String` | Required | The buy button's text. |
| `suggestedPriceUsd` | `Decimal` | Optional | The AI's price suggestion, in USD. |
| `suggestedShippingUsd` | `Decimal` | Optional | The AI's shipping suggestion, in USD. |
| `imageAlt` | `String` | Optional | Alt text for the product photo. |
| `heroPrompt` | `String` | Optional | The prompt used to generate hero art for the page. |


# Example (as JSON)

```json
{
  "productType": "physical",
  "productName": "Vintage Cream and Red Roller Skates",
  "layout": "bold-hero",
  "palette": {
    "background": "#f7f1e8",
    "surface": "#ffffff",
    "text": "#1f1a17",
    "muted": "#6b625b",
    "accent": "#b3262d",
    "accentText": "#ffffff"
  },
  "fonts": {
    "heading": "Playfair Display",
    "body": "Inter"
  },
  "eyebrow": "One pair, restored",
  "headline": "Classic quad skates crafted with walnut burl heels",
  "subheadline": "A vintage pair of skates with cream leather, bold red trim and quad wheels.",
  "story": "Each pair combines soft cream leather with distinct red accents and a sculpted walnut burl heel base.",
  "bullets": [
    "Walnut burl heels",
    "Restored vintage leather"
  ],
  "details": [
    {
      "label": "Material",
      "value": "Leather upper, walnut burl heel, rubber wheels"
    }
  ],
  "faq": [
    {
      "q": "Are these suitable for outdoor skating?",
      "a": "Yes, on indoor rink floors and paved outdoor paths."
    }
  ],
  "ctaLabel": "Buy the skates",
  "suggestedPriceUsd": 240,
  "suggestedShippingUsd": 15,
  "imageAlt": "Cream leather quad roller skates with red trim",
  "heroPrompt": "Cream roller skates on a sunlit boardwalk, in warm cream and red tones"
}
```



