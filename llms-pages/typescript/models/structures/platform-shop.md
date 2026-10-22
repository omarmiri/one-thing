# Platform Shop

Source: /#/typescript/x-redirect/JTI0bSUyRlBsYXRmb3JtU2hvcA


# Interface Name

`PlatformShop`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `string` | Required | - |
| `status` | [`Status`](/llms-pages/typescript/models/enumerations/status.md) | Required | - |
| `name` | `string` | Required | - |
| `headline` | `string \| undefined` | Optional | - |
| `productType` | [`ProductType1`](/llms-pages/typescript/models/enumerations/product-type-1.md) | Required | - |
| `price` | [`AgentMoney`](/llms-pages/typescript/models/structures/agent-money.md) | Required | - |
| `url` | `string` | Required | The shop page buyers pay on. |
| `cover` | `string \| null \| undefined` | Optional | The cover image's URL. |
| `paypalConnected` | `boolean` | Required | The seller connected a PayPal account that can be paid. |
| `sales` | `number` | Required | Paid orders. |
| `createdAt` | `string` | Required | - |


# Example

```ts
import { PlatformShop, ProductType1, Status } from 'one-thing-sdk';

const platformShop: PlatformShop = {
  slug: 'slug4',
  status: Status.Draft,
  name: 'name0',
  productType: ProductType1.Digital,
  price: {
    amount: 48.5,
    currency: 'USD',
    label: '$48.50',
  },
  url: 'url4',
  paypalConnected: false,
  sales: 22,
  createdAt: '2016-03-13T12:52:32.123Z',
  headline: 'headline0',
  cover: 'cover4',
};
```



