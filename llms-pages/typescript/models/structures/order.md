# Order

Source: /#/typescript/x-redirect/JTI0bSUyRk9yZGVy


# Interface Name

`Order`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `string` | Required | - |
| `paypalOrderId` | `string \| null \| undefined` | Optional | - |
| `status` | [`Status2`](/llms-pages/typescript/models/enumerations/status-2.md) | Required | - |
| `amountCents` | `number` | Required | - |
| `shippingCents` | `number \| undefined` | Optional | - |
| `currency` | `string` | Required | - |
| `buyerEmail` | `string \| null \| undefined` | Optional | - |
| `buyerName` | `string \| null \| undefined` | Optional | - |
| `shippingAddress` | `Record<string, string> \| null \| undefined` | Optional | - |
| `captureId` | `string \| null \| undefined` | Optional | - |
| `fulfillmentStatus` | [`FulfillmentStatus`](/llms-pages/typescript/models/enumerations/fulfillment-status.md) | Required | - |
| `carrier` | `string \| null \| undefined` | Optional | - |
| `trackingNumber` | `string \| null \| undefined` | Optional | - |
| `trackingSynced` | `boolean \| undefined` | Optional | - |
| `downloads` | `number \| undefined` | Optional | - |
| `accessCode` | `string \| null \| undefined` | Optional | - |
| `codeUses` | `number \| undefined` | Optional | - |
| `paidAt` | `string \| null \| undefined` | Optional | - |
| `createdAt` | `string \| undefined` | Optional | - |


# Example

```ts
import { FulfillmentStatus, Order, Status2 } from 'one-thing-sdk';

const order: Order = {
  id: 'id6',
  status: Status2.Created,
  amountCents: 96,
  currency: 'currency6',
  fulfillmentStatus: FulfillmentStatus.None,
  paypalOrderId: 'paypal_order_id6',
  shippingCents: 106,
  buyerEmail: 'buyer_email8',
  buyerName: 'buyer_name4',
  shippingAddress: {
    'key0': 'shipping_address6',
    'key1': 'shipping_address5',
    'key2': 'shipping_address4'
  },
};
```



