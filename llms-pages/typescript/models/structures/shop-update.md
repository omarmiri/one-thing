# Shop Update

Source: /#/typescript/x-redirect/JTI0bSUyRlNob3BVcGRhdGU

The fields to change. Anything left out stays as it is.


# Interface Name

`ShopUpdate`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `string \| undefined` | Optional | A new link name. The old one keeps redirecting. |
| `status` | [`Status \| undefined`](/llms-pages/typescript/models/enumerations/status.md) | Optional | `live` publishes the shop; `draft` takes it down. |
| `productType` | [`ProductType \| undefined`](/llms-pages/typescript/models/enumerations/product-type.md) | Optional | `referral` only for shops created from Channel3. |
| `price` | `number \| undefined` | Optional | The price in USD.<br><br>**Constraints**: `>= 0.5`, `<= 10000` |
| `shipping` | `number \| undefined` | Optional | Shipping per order, in USD.<br><br>**Constraints**: `>= 0`, `<= 500` |
| `stock` | `number \| null \| undefined` | Optional | How many are for sale; null for unlimited.<br><br>**Constraints**: `>= 0` |
| `shipCountries` | `string \| null \| undefined` | Optional | Comma-separated ISO country codes; null or empty means anywhere PayPal ships. |
| `delivery` | [`Delivery1 \| undefined`](/llms-pages/typescript/models/enumerations/delivery-1.md) | Optional | Digital products: `file` or `access_code`. |
| `accessUrl` | `string \| null \| undefined` | Optional | Access-code products: where buyers enter their code. |
| `paypalEmail` | `string \| null \| undefined` | Optional | The PayPal account paid when no account is connected. |
| `sellerEmail` | `string \| null \| undefined` | Optional | Where order notifications go. |
| `zapierHookUrl` | `string \| null \| undefined` | Optional | A Zapier Catch Hook for order events; null removes it. |
| `inGallery` | `boolean \| undefined` | Optional | Feature the shop at `/gallery` while it's live. Off by default. |
| `options` | [`ShopOption[] \| undefined`](/llms-pages/typescript/models/structures/shop-option.md) | Optional | What the buyer picks (physical products only), replacing the current options; `[]` removes them. With options, stock is counted per combination in `option_stock` and the shop's own `stock` is cleared. At most 60 combinations.<br><br>**Constraints**: *Maximum Items*: `3` |
| `optionStock` | `Record<string, number \| null> \| undefined` | Optional | Stock per combination, keyed by its values in option order joined with `/` (e.g. `M / Black`). A missing key or `null` means unlimited; `0` is sold out.<br><br>**Constraints**: `>= 0` |
| `facts` | [`Fact[] \| undefined`](/llms-pages/typescript/models/structures/fact.md) | Optional | Answers to the "buyers will ask" questions in `suggestions.missingFacts`. Each becomes a product detail on the page (replacing one with the same label) and drops off the list.<br><br>**Constraints**: *Maximum Items*: `5` |


# Example

```ts
import {
  Delivery1,
  Kind,
  ProductType,
  ShopUpdate,
  Status,
} from 'one-thing-sdk';

const shopUpdate: ShopUpdate = {
  slug: 'vintageskates',
  status: Status.Draft,
  productType: ProductType.Physical,
  price: 240,
  shipping: 15,
  stock: 7,
  shipCountries: 'US,CA',
  delivery: Delivery1.File,
  accessUrl: 'https://www.miriogames.com/raptor-rush/',
  paypalEmail: 'seller@example.com',
  sellerEmail: 'seller@example.com',
  zapierHookUrl: 'https://hooks.zapier.com/hooks/catch/123456/abcdef/',
  inGallery: true,
  options: [
    {
      name: 'Size',
      kind: Kind.Size,
      values: [
        {
          label: 'S',
        },
        {
          label: 'M',
        },
        {
          label: 'L',
        }
      ],
    }
  ],
  optionStock: {
    'M / Black': 4,
    'L / Black': 0
  },
  facts: [
    {
      label: 'Size',
      value: 'US women\'s 8',
    }
  ],
};
```



