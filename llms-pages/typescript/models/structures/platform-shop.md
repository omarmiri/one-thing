# Platform Shop

Source: /#/typescript/x-redirect/JTI0bSUyRlBsYXRmb3JtU2hvcA

A shop as a platform API key lists it.


# Interface Name

`PlatformShop`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `string` | Required | The shop's link name. |
| `status` | [`Status3`](/llms-pages/typescript/models/enumerations/status-3.md) | Required | `draft` until the seller goes live. |
| `name` | `string` | Required | The product's name. |
| `headline` | `string \| undefined` | Optional | The shop's one-line pitch. |
| `productType` | [`ProductType3`](/llms-pages/typescript/models/enumerations/product-type-3.md) | Required | `physical`, `digital` or `referral`. |
| `price` | [`AgentMoney`](/llms-pages/typescript/models/structures/agent-money.md) | Required | An amount of money, as a number and as a label. |
| `url` | `string` | Required | The shop page buyers pay on. |
| `cover` | `string \| null \| undefined` | Optional | The cover image's URL. |
| `paypalConnected` | `boolean` | Required | The seller connected a PayPal account that can be paid. |
| `sales` | `number` | Required | Paid orders. |
| `createdAt` | `string` | Required | When the shop was made. |


# Example

```ts
import { PlatformShop, ProductType3, Status3 } from 'one-thing-sdk';

const platformShop: PlatformShop = {
  slug: 'vintageskates',
  status: Status3.Draft,
  name: 'Vintage Cream and Red Roller Skates',
  productType: ProductType3.Physical,
  price: {
    amount: 240,
    currency: 'USD',
    label: '$240.00',
  },
  url: 'https://one-thing-ash0.onrender.com/vintageskates',
  paypalConnected: true,
  sales: 12,
  createdAt: '2026-10-22T02:41:37Z',
  headline: 'Classic quad skates crafted with walnut burl heels',
  cover: 'https://one-thing-ash0.onrender.com/api/blobs/LFRvGuTU3D8i334X',
};
```



