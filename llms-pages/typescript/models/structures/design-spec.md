# Design Spec

Source: /#/typescript/x-redirect/JTI0bSUyRkRlc2lnblNwZWM

What Gemini designed. OneThing's templates render it; Gemini never writes HTML.


# Interface Name

`DesignSpec`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `productType` | [`ProductType2`](/llms-pages/typescript/models/enumerations/product-type-2.md) | Required | What the AI decided the product is. |
| `productName` | `string` | Required | The product's name. |
| `layout` | [`Layout`](/llms-pages/typescript/models/enumerations/layout.md) | Required | The page template: `bold-hero` (image first, punchy), `editorial` (magazine), `minimal` (quiet, lots of space) or `playful`. |
| `palette` | [`Palette`](/llms-pages/typescript/models/structures/palette.md) | Required | The page colours, taken from the photo. Text colours are checked for contrast. |
| `fonts` | [`Fonts`](/llms-pages/typescript/models/structures/fonts.md) | Required | Google Fonts for the page. |
| `eyebrow` | `string \| undefined` | Optional | A short label above the headline. |
| `headline` | `string` | Required | The page's main headline. |
| `subheadline` | `string \| undefined` | Optional | A line under the headline. |
| `story` | `string \| undefined` | Optional | A short paragraph about the product. |
| `bullets` | `string[]` | Required | Short selling points. |
| `details` | [`Detail[] \| undefined`](/llms-pages/typescript/models/structures/detail.md) | Optional | Product facts shown on the page. |
| `faq` | [`Faq[]`](/llms-pages/typescript/models/structures/faq.md) | Required | Questions buyers will ask, with answers. |
| `ctaLabel` | `string` | Required | The buy button's text. |
| `suggestedPriceUsd` | `number \| undefined` | Optional | The AI's price suggestion, in USD. |
| `suggestedShippingUsd` | `number \| undefined` | Optional | The AI's shipping suggestion, in USD. |
| `imageAlt` | `string \| undefined` | Optional | Alt text for the product photo. |
| `heroPrompt` | `string \| undefined` | Optional | The prompt used to generate hero art for the page. |


# Example

```ts
import { DesignSpec, Layout, ProductType2 } from 'one-thing-sdk';

const designSpec: DesignSpec = {
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
};
```



