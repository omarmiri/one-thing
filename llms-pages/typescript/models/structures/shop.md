# Shop

Source: /#/typescript/x-redirect/JTI0bSUyRlNob3A

A shop, as its seller sees it.


# Interface Name

`Shop`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `string` | Required | OneThing's internal shop id. |
| `slug` | `string` | Required | The shop's link name. |
| `status` | [`Status1`](/llms-pages/typescript/models/enumerations/status-1.md) | Required | `draft` until the seller goes live; only `live` shops take orders. |
| `productType` | [`ProductType1`](/llms-pages/typescript/models/enumerations/product-type-1.md) | Required | `physical` ships, `digital` downloads or unlocks, `referral` recommends a Channel3 product. |
| `priceCents` | `number` | Required | The price in cents. |
| `currency` | `string` | Required | ISO 4217 currency code. |
| `shippingCents` | `number \| undefined` | Optional | Shipping per order, in cents. |
| `shipCountries` | `string \| null \| undefined` | Optional | Comma-separated ISO country codes; null or empty means anywhere PayPal ships. |
| `stock` | `number \| null \| undefined` | Optional | How many are left; null for unlimited. With options, see `option_stock`. |
| `delivery` | [`Delivery2 \| undefined`](/llms-pages/typescript/models/enumerations/delivery-2.md) | Optional | Digital products: `file` (a download) or `access_code` (a code that unlocks an app or game). |
| `accessUrl` | `string \| null \| undefined` | Optional | Access-code products: where buyers enter their code. |
| `paypalEmail` | `string \| null \| undefined` | Optional | The PayPal account paid when no account is connected. |
| `sellerEmail` | `string \| null \| undefined` | Optional | Where order notifications go. |
| `paypalMerchantId` | `string \| null \| undefined` | Optional | The connected PayPal account (`connectPayPal`). Sales go here when it can receive payments. |
| `paypalStatus` | [`ShopPaypalStatus \| null \| undefined`](/llms-pages/typescript/models/oneof-anyof-definitions/shop-paypal-status.md) | Optional | This is a container for one-of cases. |
| `zapierHookUrl` | `string \| null \| undefined` | Optional | A Zapier Catch Hook that gets an `OrderEvent` for each paid, shipped or refunded order. |
| `inGallery` | `boolean \| undefined` | Optional | Whether the shop is featured at `/gallery` while live. |
| `accountId` | `string \| null \| undefined` | Optional | The seller account that owns the shop, if it was made while signed in. |
| `options` | [`ShopOption[] \| undefined`](/llms-pages/typescript/models/structures/shop-option.md) | Optional | What the buyer picks, such as size or colour. |
| `optionStock` | `Record<string, number \| null> \| undefined` | Optional | Stock per combination, keyed by its values in option order joined with `/` (e.g. `M / Black`). A missing key or `null` means unlimited; `0` is sold out.<br><br>**Constraints**: `>= 0` |
| `suggestions` | [`ShopSuggestions \| null \| undefined`](/llms-pages/typescript/models/oneof-anyof-definitions/shop-suggestions.md) | Optional | This is a container for one-of cases. |
| `photoBlob` | `string \| null \| undefined` | Optional | Image id for `getImage`. The cover photo. |
| `galleryBlobs` | `string[] \| undefined` | Optional | The other photos, in order. |
| `heroBlob` | `string \| null \| undefined` | Optional | Image id of the AI hero art, when there is one. |
| `heroStatus` | [`HeroStatus \| undefined`](/llms-pages/typescript/models/enumerations/hero-status.md) | Optional | Hero art: `pending` while generating, then `ready` or `failed`; `none` if not requested. |
| `heroError` | `string \| null \| undefined` | Optional | Why hero art failed, when it did. |
| `aiSource` | [`AiSource \| undefined`](/llms-pages/typescript/models/enumerations/ai-source.md) | Optional | Who designed the page: `gemini`, or `fallback` when Gemini wasn't available and a plain template was used. |
| `sourceUrl` | `string \| null \| undefined` | Optional | The product link the shop was made from, if any. |
| `referral` | [`ShopReferral \| null \| undefined`](/llms-pages/typescript/models/oneof-anyof-definitions/shop-referral.md) | Optional | This is a container for one-of cases. |
| `spec` | [`DesignSpec`](/llms-pages/typescript/models/structures/design-spec.md) | Required | What Gemini designed. OneThing's templates render it; Gemini never writes HTML. |
| `createdAt` | `string \| undefined` | Optional | When the shop was made. |


# Example

```ts
import {
  AiSource,
  Delivery2,
  HeroStatus,
  Kind,
  Layout,
  ProductType1,
  ProductType2,
  Shop,
  Status1,
} from 'one-thing-sdk';

const shop: Shop = {
  id: 'shp_8Hc2LmQ4',
  slug: 'vintageskates',
  status: Status1.Draft,
  productType: ProductType1.Physical,
  priceCents: 24000,
  currency: 'USD',
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
  shippingCents: 1500,
  shipCountries: 'US,CA',
  stock: 7,
  delivery: Delivery2.File,
  accessUrl: 'https://www.miriogames.com/raptor-rush/',
  paypalEmail: 'seller@example.com',
  sellerEmail: 'seller@example.com',
  paypalMerchantId: '7MZJ4QXN8K2LA',
  paypalStatus: {
    receivable: true,
    emailConfirmed: true,
    checkedAt: '2026-10-22T02:41:37Z',
  },
  zapierHookUrl: 'https://hooks.zapier.com/hooks/catch/123456/abcdef/',
  inGallery: true,
  accountId: 'acc_Vq3nN8cT0bLx2YwE',
  options: [
    {
      name: 'Size',
      kind: Kind.Size,
      values: [
        {
          label: 'S',
          hex: 'hex4',
          photo: 'photo6',
        },
        {
          label: 'M',
          hex: 'hex4',
          photo: 'photo6',
        },
        {
          label: 'L',
          hex: 'hex4',
          photo: 'photo6',
        }
      ],
    }
  ],
  optionStock: {
    'M / Black': 4,
    'L / Black': 0
  },
  suggestions: {
    oneOfAKind: false,
    options: [
      {
        name: 'Size',
        kind: Kind.Size,
        values: [
          {
            label: 'S',
            hex: 'hex4',
            photo: 'photo6',
          },
          {
            label: 'M',
            hex: 'hex4',
            photo: 'photo6',
          },
          {
            label: 'L',
            hex: 'hex4',
            photo: 'photo6',
          }
        ],
        fromSeller: false,
      }
    ],
    missingFacts: [
      {
        label: 'Size',
        question: 'What size are the skates?',
        placeholder: 'US women\'s 8',
      }
    ],
  },
  photoBlob: 'LFRvGuTU3D8i334X',
  galleryBlobs: [
    'zrySajNyao6_j11x',
    'SuqcgNv64HWN8H6e'
  ],
  heroBlob: 'Hn2Kd8sQp4LmZ0vX',
  heroStatus: HeroStatus.None,
  heroError: 'No image model on this key returned an image.',
  aiSource: AiSource.Gemini,
  sourceUrl: 'https://example.com/products/roller-skates',
  referral: {
    productId: 'ch3_7f2a9c1e',
    title: 'Trail Running Vest 5L',
    offers: [
      {
        domain: 'rei.com',
        url: 'https://buy.trychannel3.com/r/abc123',
        price: 240,
        currency: 'USD',
        inStock: true,
        commission: 0.08,
      }
    ],
    brand: 'Salomon',
    image: 'https://images.example.com/vest.jpg',
  },
  createdAt: '2026-10-22T02:41:37Z',
};
```



