# Api Shops Refine Response

Source: /#/http/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyMFJlZmluZSUyNTIwUmVzcG9uc2U

The redesigned page.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `spec` | [`Design Spec`](/llms-pages/http/models/structures/design-spec.md) | Required | What Gemini designed. OneThing's templates render it; Gemini never writes HTML. |


# Example (as JSON)

```json
{
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
  }
}
```



