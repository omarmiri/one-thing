# Create Shop Form

Source: /#/typescript/x-redirect/JTI0bSUyRkNyZWF0ZVNob3BGb3Jt


# Interface Name

`CreateShopForm`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `source` | [`Source`](/llms-pages/typescript/models/enumerations/source.md) | Required | - |
| `photo` | `string \| undefined` | Optional | `source=photo`: the product photo, up to 8 MB. |
| `description` | `string \| undefined` | Optional | `source=photo`: a sentence or two about the product. Required if there is no photo. |
| `url` | `string \| undefined` | Optional | `source=link`: a product page, or your own app or game page. |
| `productId` | `string \| undefined` | Optional | `source=channel3`: a product id from `searchProducts`. |
| `slug` | `string \| undefined` | Optional | The link name you want. If omitted, the AI suggests one. |
| `type` | [`Type \| undefined`](/llms-pages/typescript/models/enumerations/type.md) | Optional | **Default**: `Type.Auto` |
| `delivery` | [`Delivery \| undefined`](/llms-pages/typescript/models/enumerations/delivery.md) | Optional | For digital products. If omitted, the AI guesses. |
| `accessUrl` | `string \| undefined` | Optional | Where buyers use an access code. |
| `price` | `number \| undefined` | Optional | USD. If omitted, the AI suggests a price. |
| `shipping` | `number \| undefined` | Optional | - |
| `stock` | `number \| undefined` | Optional | - |
| `shipCountries` | `string \| undefined` | Optional | - |
| `paypalEmail` | `string \| undefined` | Optional | - |
| `sellerEmail` | `string \| undefined` | Optional | - |
| `digitalFile` | `string \| undefined` | Optional | - |


# Example

```ts
import { CreateShopForm, Source, Type } from 'one-thing-sdk';

const createShopForm: CreateShopForm = {
  source: Source.Link,
  photo: 'photo2',
  description: 'description8',
  url: 'url6',
  productId: 'productId4',
  slug: 'slug4',
  type: Type.Auto,
  shipCountries: 'US',
};
```



