# Api Shops Refine Response

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyMFJlZmluZSUyNTIwUmVzcG9uc2U


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
    productType: ProductType2.Digital,
    productName: 'productName2',
    layout: Layout.Minimal,
    palette: {
      background: '#14171a',
      surface: '#14171a',
      text: '#14171a',
      muted: '#14171a',
      accent: '#14171a',
      accentText: '#14171a',
    },
    fonts: {
      heading: 'heading2',
      body: 'body6',
    },
    headline: 'headline2',
    bullets: [
      'bullets0',
      'bullets1',
      'bullets2'
    ],
    faq: [
      {
        q: 'q0',
        a: 'a8',
      }
    ],
    ctaLabel: 'ctaLabel6',
    eyebrow: 'eyebrow6',
    subheadline: 'subheadline8',
    story: 'story6',
    details: [
      {
        label: 'label0',
        value: 'value2',
      },
      {
        label: 'label0',
        value: 'value2',
      },
      {
        label: 'label0',
        value: 'value2',
      }
    ],
    suggestedPriceUsd: 233.64,
  },
};
```



