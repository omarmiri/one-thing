# Api Shops Refine Response

Source: /#/http/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyMFJlZmluZSUyNTIwUmVzcG9uc2U


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `spec` | [`Design Spec`](/llms-pages/http/models/structures/design-spec.md) | Required | What Gemini designed. OneThing's templates render it; Gemini never writes HTML. |


# Example (as JSON)

```json
{
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
  }
}
```



