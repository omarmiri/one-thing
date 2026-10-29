# Refine Shop Design

Source: /#/python/x-redirect/JTI0ZSUyRlNob3BzJTJGcmVmaW5lU2hvcERlc2lnbg

"Make it warmer", "shorter copy", "more premium". Gemini edits the design spec.

```python
def refine_shop_design(self,
                      slug,
                      body)
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/python/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/python/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Template, Required | The shop's link name (current or former). |
| `body` | [`ApiShopsRefineRequest`](/llms-pages/python/models/structures/api-shops-refine-request.md) | Body, Required | - |


# Response Type

**200**: The new design.

[`ApiShopsRefineResponse`](/llms-pages/python/models/structures/api-shops-refine-response.md)


# Example Usage

```python
slug = 'raptorrush'

body = ApiShopsRefineRequest(
    instruction='Make it feel more premium'
)

result = shops_api.refine_shop_design(
    slug,
    body
)
print(result)
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
| 400 | Something in the request needs fixing; `error` says what. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 429 | Over this network's cap for the call (see **Limits**). Retry after `Retry-After` seconds. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |



