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


# Example

```ts
import { ProductType, ShopUpdate, Status } from 'one-thing-sdk';

const shopUpdate: ShopUpdate = {
  slug: 'slug6',
  status: Status.Draft,
  productType: ProductType.Physical,
  price: 59.62,
  shipping: 61.84,
};
```



