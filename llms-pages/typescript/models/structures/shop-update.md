# Shop Update

Source: /#/typescript/x-redirect/JTI0bSUyRlNob3BVcGRhdGU


# Interface Name

`ShopUpdate`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `string \| undefined` | Optional | - |
| `status` | [`Status \| undefined`](/llms-pages/typescript/models/enumerations/status.md) | Optional | - |
| `productType` | [`ProductType \| undefined`](/llms-pages/typescript/models/enumerations/product-type.md) | Optional | `referral` only for shops created from Channel3. |
| `price` | `number \| undefined` | Optional | **Constraints**: `>= 0.5`, `<= 10000` |
| `shipping` | `number \| undefined` | Optional | **Constraints**: `>= 0`, `<= 500` |
| `stock` | `number \| null \| undefined` | Optional | **Constraints**: `>= 0` |
| `shipCountries` | `string \| null \| undefined` | Optional | - |
| `delivery` | [`Delivery1 \| undefined`](/llms-pages/typescript/models/enumerations/delivery-1.md) | Optional | - |
| `accessUrl` | `string \| null \| undefined` | Optional | - |
| `paypalEmail` | `string \| null \| undefined` | Optional | - |
| `sellerEmail` | `string \| null \| undefined` | Optional | - |
| `zapierHookUrl` | `string \| null \| undefined` | Optional | - |
| `inGallery` | `boolean \| undefined` | Optional | Feature the shop at `/gallery` while it's live. Off by default. |
| `options` | [`ShopOption[] \| undefined`](/llms-pages/typescript/models/structures/shop-option.md) | Optional | What the buyer picks (physical products only), replacing the current options; `[]` removes them. With options, stock is counted per combination in `option_stock` and the shop's own `stock` is cleared. At most 60 combinations.<br><br>**Constraints**: *Maximum Items*: `3` |
| `optionStock` | `Record<string, number \| null> \| undefined` | Optional | Stock per combination, keyed by its values in option order joined with `/` (e.g. `M / Black`). A missing key or `null` means unlimited; `0` is sold out.<br><br>**Constraints**: `>= 0` |
| `facts` | [`Fact[] \| undefined`](/llms-pages/typescript/models/structures/fact.md) | Optional | Answers to the "buyers will ask" questions in `suggestions.missingFacts`. Each becomes a product detail on the page (replacing one with the same label) and drops off the list.<br><br>**Constraints**: *Maximum Items*: `5` |


# Example

```ts
import { ProductType, ShopUpdate, Status } from 'one-thing-sdk';

const shopUpdate: ShopUpdate = {
  slug: 'slug6',
  status: Status.Draft,
  productType: ProductType.Physical,
  price: 59.62,
  shipping: 61.84,
  optionStock: {
    'M / Black': 4,
    'L / Black': 0
  },
};
```



