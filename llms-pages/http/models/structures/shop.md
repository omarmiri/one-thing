# Shop

Source: /#/http/x-redirect/JTI0bSUyRlNob3A

A shop, as its seller sees it.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `String` | Required | OneThing's internal shop id. |
| `slug` | `String` | Required | The shop's link name. |
| `status` | [`Status 1`](/llms-pages/http/models/enumerations/status-1.md) | Required | `draft` until the seller goes live; only `live` shops take orders. |
| `product_type` | [`Product Type 1`](/llms-pages/http/models/enumerations/product-type-1.md) | Required | `physical` ships, `digital` downloads or unlocks, `referral` recommends a Channel3 product. |
| `price_cents` | `Number` | Required | The price in cents. |
| `currency` | `String` | Required | ISO 4217 currency code. |
| `shipping_cents` | `Number` | Optional | Shipping per order, in cents. |
| `ship_countries` | `String` | Optional | Comma-separated ISO country codes; null or empty means anywhere PayPal ships. |
| `stock` | `Number` | Optional | How many are left; null for unlimited. With options, see `option_stock`. |
| `delivery` | [`Delivery 2`](/llms-pages/http/models/enumerations/delivery-2.md) | Optional | Digital products: `file` (a download) or `access_code` (a code that unlocks an app or game). |
| `access_url` | `String` | Optional | Access-code products: where buyers enter their code. |
| `paypal_email` | `String` | Optional | The PayPal account paid when no account is connected. |
| `seller_email` | `String` | Optional | Where order notifications go. |
| `paypal_merchant_id` | `String` | Optional | The connected PayPal account (`connectPayPal`). Sales go here when it can receive payments. |
| `paypal_status` | [`Pay Pal Status`](/llms-pages/http/models/oneof-anyof-definitions/shop-paypal-status.md) | Optional | What PayPal last said about the connected account; null when none is connected. |
| `zapier_hook_url` | `String` | Optional | A Zapier Catch Hook that gets an `OrderEvent` for each paid, shipped or refunded order. |
| `in_gallery` | `Boolean` | Optional | Whether the shop is featured at `/gallery` while live. |
| `account_id` | `String` | Optional | The seller account that owns the shop, if it was made while signed in. |
| `options` | [`array<Shop Option>`](/llms-pages/http/models/structures/shop-option.md) | Optional | What the buyer picks, such as size or colour. |
| `option_stock` | `map<Number>` | Optional | Stock per combination, keyed by its values in option order joined with `/` (e.g. `M / Black`). A missing key or `null` means unlimited; `0` is sold out.<br><br>**Constraints**: `>= 0` |
| `suggestions` | [`Suggestions`](/llms-pages/http/models/oneof-anyof-definitions/shop-suggestions.md) | Optional | What the AI thinks buyers will pick or ask; null once handled. |
| `photo_blob` | `String` | Optional | Image id for `getImage`. The cover photo. |
| `gallery_blobs` | `array<String>` | Optional | The other photos, in order. |
| `hero_blob` | `String` | Optional | Image id of the AI hero art, when there is one. |
| `hero_status` | [`Hero Status`](/llms-pages/http/models/enumerations/hero-status.md) | Optional | Hero art: `pending` while generating, then `ready` or `failed`; `none` if not requested. |
| `hero_error` | `String` | Optional | Why hero art failed, when it did. |
| `ai_source` | [`Ai Source`](/llms-pages/http/models/enumerations/ai-source.md) | Optional | Who designed the page: `gemini`, or `fallback` when Gemini wasn't available and a plain template was used. |
| `source_url` | `String` | Optional | The product link the shop was made from, if any. |
| `referral` | [`Referral`](/llms-pages/http/models/oneof-anyof-definitions/shop-referral.md) | Optional | Recommendation shops: the Channel3 product; null otherwise. |
| `spec` | [`Design Spec`](/llms-pages/http/models/structures/design-spec.md) | Required | What Gemini designed. OneThing's templates render it; Gemini never writes HTML. |
| `created_at` | `DateTime` | Optional | When the shop was made. |


# Example (as JSON)

```json
{
  "id": "shp_8Hc2LmQ4",
  "slug": "vintageskates",
  "status": "draft",
  "product_type": "physical",
  "price_cents": 24000,
  "currency": "USD",
  "shipping_cents": 1500,
  "ship_countries": "US,CA",
  "stock": 7,
  "delivery": "file",
  "access_url": "https://www.miriogames.com/raptor-rush/",
  "paypal_email": "seller@example.com",
  "seller_email": "seller@example.com",
  "paypal_merchant_id": "7MZJ4QXN8K2LA",
  "paypal_status": {
    "receivable": true,
    "emailConfirmed": true,
    "checkedAt": "2026-10-22T02:41:37Z"
  },
  "zapier_hook_url": "https://hooks.zapier.com/hooks/catch/123456/abcdef/",
  "in_gallery": true,
  "account_id": "acc_Vq3nN8cT0bLx2YwE",
  "options": [
    {
      "name": "Size",
      "kind": "size",
      "values": [
        {
          "label": "S"
        },
        {
          "label": "M"
        },
        {
          "label": "L"
        }
      ]
    }
  ],
  "option_stock": {
    "M / Black": 4,
    "L / Black": 0
  },
  "suggestions": {
    "oneOfAKind": false,
    "options": [
      {
        "name": "Size",
        "kind": "size",
        "values": [
          {
            "label": "S"
          },
          {
            "label": "M"
          },
          {
            "label": "L"
          }
        ]
      }
    ],
    "missingFacts": [
      {
        "label": "Size",
        "question": "What size are the skates?",
        "placeholder": "US women's 8"
      }
    ]
  },
  "photo_blob": "LFRvGuTU3D8i334X",
  "gallery_blobs": [
    "zrySajNyao6_j11x",
    "SuqcgNv64HWN8H6e"
  ],
  "hero_blob": "Hn2Kd8sQp4LmZ0vX",
  "hero_status": "none",
  "hero_error": "No image model on this key returned an image.",
  "ai_source": "gemini",
  "source_url": "https://example.com/products/roller-skates",
  "referral": {
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
  },
  "spec": {
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
    "suggestedPriceUsd": 240.0,
    "suggestedShippingUsd": 15,
    "imageAlt": "Cream leather quad roller skates with red trim",
    "heroPrompt": "Cream roller skates on a sunlit boardwalk, in warm cream and red tones"
  },
  "created_at": "2026-10-22T02:41:37Z"
}
```



