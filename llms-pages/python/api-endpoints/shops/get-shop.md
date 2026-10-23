# Get Shop

Source: /#/python/x-redirect/JTI0ZSUyRlNob3BzJTJGZ2V0U2hvcA

Everything about the shop, including the AI's design spec and guesses.

```python
def get_shop(self,
            slug)
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/python/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/python/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Template, Required | The shop's link name (current or former). |


# Response Type

**200**: The shop.

[`Shop`](/llms-pages/python/models/structures/shop.md)


# Example Usage

```python
slug = 'raptorrush'

result = shops_api.get_shop(slug)
print(result)
```


# Example Response *(as JSON)*

```json
{
  "id": "Hn2c8QvL0xTzR4pW",
  "slug": "vintageskates",
  "status": "live",
  "product_type": "physical",
  "price_cents": 24000,
  "currency": "USD",
  "shipping_cents": 1500,
  "ship_countries": "US",
  "stock": null,
  "delivery": "file",
  "access_url": null,
  "paypal_email": "seller@example.com",
  "seller_email": "seller@example.com",
  "paypal_merchant_id": "7MZJ4QXN8K2LA",
  "paypal_status": {
    "receivable": true,
    "emailConfirmed": true,
    "checkedAt": "2026-10-21T18:04:11Z"
  },
  "zapier_hook_url": null,
  "in_gallery": true,
  "account_id": "Vq3nN8cT0bLx2YwE",
  "options": [
    {
      "name": "Size",
      "kind": "size",
      "values": [
        {
          "label": "7"
        },
        {
          "label": "8"
        },
        {
          "label": "9"
        }
      ]
    }
  ],
  "option_stock": {
    "7": 3,
    "8": 0,
    "9": 6
  },
  "suggestions": null,
  "photo_blob": "LFRvGuTU3D8i334X",
  "gallery_blobs": [
    "zrySajNyao6_j11x",
    "SuqcgNv64HWN8H6e"
  ],
  "hero_blob": null,
  "hero_status": "none",
  "hero_error": null,
  "ai_source": "gemini",
  "source_url": null,
  "referral": null,
  "spec": {
    "productType": "physical",
    "productName": "Vintage Cream and Red Roller Skates",
    "layout": "editorial",
    "palette": {
      "background": "#f6efe4",
      "surface": "#fffaf2",
      "text": "#2b1d14",
      "muted": "#7a6455",
      "accent": "#b3261e",
      "accentText": "#ffffff"
    },
    "fonts": {
      "heading": "Playfair Display",
      "body": "Inter"
    },
    "eyebrow": "One pair, restored",
    "headline": "Classic quad skates crafted with walnut burl heels",
    "subheadline": "A vintage pair of skates featuring cream leather, bold red trim, and durable quad wheels.",
    "story": "Each pair combines soft cream leather with distinct red accents and a sculpted walnut burl heel base.",
    "bullets": [
      "Handmade cream leather upper with rich red trim",
      "Sculpted walnut burl heel structure for stability"
    ],
    "details": [
      {
        "label": "Materials",
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
    "imageAlt": "Cream leather quad roller skates with red trim"
  },
  "created_at": "2026-10-19T15:22:08Z"
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |



