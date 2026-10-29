# Api Shops Refine Response

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyMFJlZmluZSUyNTIwUmVzcG9uc2U

The redesigned page.


# Interface Name

`ApiShopsRefineResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `spec` | [`DesignSpec`](/llms-pages/typescript/models/structures/design-spec.md) | Required | What Gemini designed. OneThing's templates render it; Gemini never writes HTML. |


# Example

```ts
import { ApiShopsRefineResponse, Layout, ProductType2 } from 'one-thing-sdk';

const apiShopsRefineResponse: ApiShopsRefineResponse = {
  spec: {
    productType: ProductType2.Physical,
    productName: 'Vintage Cream and Red Roller Skates',
    layout: Layout.Boldhero,
    palette: {
      background: '#f7f1e8',
      surface: '#ffffff',
      text: '#1f1a17',
      muted: '#6b625b',
      accent: '#b3262d',
      accentText: '#ffffff',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Inter',
    },
    headline: 'Classic quad skates crafted with walnut burl heels',
    bullets: [
      'Walnut burl heels',
      'Restored vintage leather'
    ],
    faq: [
      {
        q: 'Are these suitable for outdoor skating?',
        a: 'Yes, on indoor rink floors and paved outdoor paths.',
      }
    ],
    ctaLabel: 'Buy the skates',
    eyebrow: 'One pair, restored',
    subheadline: 'A vintage pair of skates with cream leather, bold red trim and quad wheels.',
    story: 'Each pair combines soft cream leather with distinct red accents and a sculpted walnut burl heel base.',
    details: [
      {
        label: 'Material',
        value: 'Leather upper, walnut burl heel, rubber wheels',
      }
    ],
    suggestedPriceUsd: 240,
    suggestedShippingUsd: 15,
    imageAlt: 'Cream leather quad roller skates with red trim',
    heroPrompt: 'Cream roller skates on a sunlit boardwalk, in warm cream and red tones',
  },
};
```



