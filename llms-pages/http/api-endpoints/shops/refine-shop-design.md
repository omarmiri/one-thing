# Refine Shop Design

Source: /#/http/x-redirect/JTI0ZSUyRlNob3BzJTJGcmVmaW5lU2hvcERlc2lnbg

"Make it warmer", "shorter copy", "more premium". Gemini edits the design spec.

```http
POST /api/shops/{slug}/refine
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/http/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/http/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Template, Required | The shop's link name (current or former). |
| `body` | [`Api Shops Refine Request`](/llms-pages/http/models/structures/api-shops-refine-request.md) | Body, Required | - |


# Response Type

**200**: The new design.

[`Api Shops Refine Response`](/llms-pages/http/models/structures/api-shops-refine-response.md)


# Example Usage

```bash
curl -X POST \
  --url 'https://one-thing-ash0.onrender.com/api/shops/raptorrush/refine'  \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'x-admin-token: x-admin-token' \
  -H 'Authorization: Bearer AccessToken' \
  --data-raw '{
  "instruction": "Make it feel more premium"
}'
```


# Example Response *(as JSON)*

```json
{
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
  }
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |



