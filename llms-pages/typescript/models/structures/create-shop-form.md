# Create Shop Form

Source: /#/typescript/x-redirect/JTI0bSUyRkNyZWF0ZVNob3BGb3Jt

What to make a shop from. Only `source` is required; the AI guesses the rest and the seller corrects it with `updateShop`.


# Interface Name

`CreateShopForm`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `source` | [`Source`](/llms-pages/typescript/models/enumerations/source.md) | Required | What the shop starts from: a photo (with an optional description), a product link, or a Channel3 product to recommend. |
| `photo` | `string \| undefined` | Optional | `source=photo`: the product photo, up to 8 MB. |
| `description` | `string \| undefined` | Optional | `source=photo`: a sentence or two about the product. Required if there is no photo. |
| `url` | `string \| undefined` | Optional | `source=link`: a product page, or your own app or game page. |
| `productId` | `string \| undefined` | Optional | `source=channel3`: a product id from `searchProducts`. |
| `slug` | `string \| undefined` | Optional | The link name you want. If omitted, the AI suggests one. |
| `type` | [`Type \| undefined`](/llms-pages/typescript/models/enumerations/type.md) | Optional | `physical` ships, `digital` is a file or an access code, `auto` lets the AI decide.<br><br>**Default**: `Type.Auto` |
| `delivery` | [`Delivery \| undefined`](/llms-pages/typescript/models/enumerations/delivery.md) | Optional | For digital products. If omitted, the AI guesses. |
| `accessUrl` | `string \| undefined` | Optional | Where buyers use an access code. |
| `price` | `number \| undefined` | Optional | USD. If omitted, the AI suggests a price. |
| `shipping` | `number \| undefined` | Optional | Physical products: shipping per order, in USD. If omitted, the AI suggests it. |
| `stock` | `number \| undefined` | Optional | How many are for sale. Leave out for unlimited. |
| `shipCountries` | `string \| undefined` | Optional | Physical products: comma-separated ISO country codes to ship to. Empty means anywhere PayPal ships. |
| `paypalEmail` | `string \| undefined` | Optional | The PayPal account that gets paid, if the seller doesn't connect one with `connectPayPal`. |
| `sellerEmail` | `string \| undefined` | Optional | Where order notifications go. |
| `digitalFile` | `string \| undefined` | Optional | Digital products sold as a file: the file buyers download, up to 25 MB. Can also be added later with `uploadDigitalFile`. |


# Example

```ts
import { CreateShopForm, Delivery, Source, Type } from 'one-thing-sdk';

const createShopForm: CreateShopForm = {
  source: Source.Photo,
  description: 'Vintage cream and red quad roller skates with walnut burl heels.',
  url: 'https://one-thing-ash0.onrender.com/vintageskates',
  productId: 'ch3_7f2a9c1e',
  slug: 'vintageskates',
  type: Type.Auto,
  delivery: Delivery.File,
  accessUrl: 'https://www.miriogames.com/raptor-rush/',
  price: 240,
  shipping: 15,
  stock: 7,
  shipCountries: 'US',
  paypalEmail: 'seller@example.com',
  sellerEmail: 'seller@example.com',
};
```



