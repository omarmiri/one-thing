# Shop

Source: /#/typescript/x-redirect/JTI0bSUyRlNob3A


# Interface Name

`Shop`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `string` | Required | - |
| `slug` | `string` | Required | - |
| `status` | [`Status`](/llms-pages/typescript/models/enumerations/status.md) | Required | - |
| `productType` | [`ProductType1`](/llms-pages/typescript/models/enumerations/product-type-1.md) | Required | - |
| `priceCents` | `number` | Required | - |
| `currency` | `string` | Required | - |
| `shippingCents` | `number \| undefined` | Optional | - |
| `shipCountries` | `string \| null \| undefined` | Optional | - |
| `stock` | `number \| null \| undefined` | Optional | - |
| `delivery` | [`Delivery1 \| undefined`](/llms-pages/typescript/models/enumerations/delivery-1.md) | Optional | - |
| `accessUrl` | `string \| null \| undefined` | Optional | - |
| `paypalEmail` | `string \| null \| undefined` | Optional | - |
| `sellerEmail` | `string \| null \| undefined` | Optional | - |
| `zapierHookUrl` | `string \| null \| undefined` | Optional | - |
| `inGallery` | `boolean \| undefined` | Optional | - |
| `photoBlob` | `string \| null \| undefined` | Optional | Image id for `getImage`. |
| `heroBlob` | `string \| null \| undefined` | Optional | - |
| `heroStatus` | [`HeroStatus \| undefined`](/llms-pages/typescript/models/enumerations/hero-status.md) | Optional | - |
| `heroError` | `string \| null \| undefined` | Optional | - |
| `aiSource` | [`AiSource \| undefined`](/llms-pages/typescript/models/enumerations/ai-source.md) | Optional | - |
| `sourceUrl` | `string \| null \| undefined` | Optional | - |
| `referral` | [`ShopReferral \| null \| undefined`](/llms-pages/typescript/models/oneof-anyof-definitions/shop-referral.md) | Optional | This is a container for one-of cases. |
| `spec` | [`DesignSpec`](/llms-pages/typescript/models/structures/design-spec.md) | Required | What Gemini designed. OneThing's templates render it; Gemini never writes HTML. |
| `createdAt` | `string \| undefined` | Optional | - |


# Example

```ts
import {
  Delivery1,
  Layout,
  ProductType1,
  ProductType2,
  Shop,
  Status,
} from 'one-thing-sdk';

const shop: Shop = {
  id: 'id0',
  slug: 'slug4',
  status: Status.Draft,
  productType: ProductType1.Digital,
  priceCents: 240,
  currency: 'USD',
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
  shippingCents: 148,
  shipCountries: 'ship_countries4',
  stock: 234,
  delivery: Delivery1.File,
  accessUrl: 'access_url0',
};
```



