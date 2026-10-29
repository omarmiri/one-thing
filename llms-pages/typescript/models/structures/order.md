# Order

Source: /#/typescript/x-redirect/JTI0bSUyRk9yZGVy

An order, as the seller sees it.


# Interface Name

`Order`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `string` | Required | OneThing's order id. |
| `paypalOrderId` | `string \| null \| undefined` | Optional | PayPal's order id. |
| `status` | [`Status4`](/llms-pages/typescript/models/enumerations/status-4.md) | Required | `created` until paid; `failed` if PayPal declined; `refunded` after a refund. |
| `amountCents` | `number` | Required | The total charged, shipping included, in cents. |
| `shippingCents` | `number \| undefined` | Optional | The shipping part of `amount_cents`. |
| `currency` | `string` | Required | ISO 4217 currency code. |
| `buyerEmail` | `string \| null \| undefined` | Optional | From PayPal, once paid. |
| `buyerName` | `string \| null \| undefined` | Optional | From PayPal, once paid. |
| `shippingAddress` | `Record<string, string> \| null \| undefined` | Optional | Physical orders: the address from PayPal checkout, by field. |
| `captureId` | `string \| null \| undefined` | Optional | PayPal's capture id, once paid. Refunds use it. |
| `fulfillmentStatus` | [`FulfillmentStatus`](/llms-pages/typescript/models/enumerations/fulfillment-status.md) | Required | `to_ship` and `shipped` for physical orders, `digital_sent` for digital ones, `none` before payment. |
| `carrier` | `string \| null \| undefined` | Optional | Shipped orders: the carrier. |
| `trackingNumber` | `string \| null \| undefined` | Optional | Shipped orders: the tracking number. |
| `trackingSynced` | `boolean \| undefined` | Optional | Whether PayPal accepted the tracking number. |
| `downloads` | `number \| undefined` | Optional | How many times the buyer downloaded the file. |
| `accessCode` | `string \| null \| undefined` | Optional | Access-code products: the code this buyer got. |
| `codeUses` | `number \| undefined` | Optional | How many times the access code was checked. |
| `codeLastUsedAt` | `string \| null \| undefined` | Optional | When the access code was last checked with `verifyAccessCode`. |
| `channel` | [`Channel \| undefined`](/llms-pages/typescript/models/enumerations/channel.md) | Optional | `agent` for orders an AI agent placed (MCP or an order link). |
| `agent` | `string \| null \| undefined` | Optional | The agent credited with an agent order, such as `Grok`. |
| `refundId` | `string \| null \| undefined` | Optional | PayPal's refund id, once refunded through OneThing. |
| `refundedAt` | `string \| null \| undefined` | Optional | When the order was refunded. |
| `options` | `Record<string, string> \| null \| undefined` | Optional | The buyer's pick, one value per option, keyed by option name (see `Choice`). |
| `paidAt` | `string \| null \| undefined` | Optional | When PayPal captured the payment. |
| `createdAt` | `string \| undefined` | Optional | When the order was made. |


# Example

```ts
import { Channel, FulfillmentStatus, Order, Status4 } from 'one-thing-sdk';

const order: Order = {
  id: 'pX4kR9tVb2nQ7sLe',
  status: Status4.Created,
  amountCents: 25500,
  currency: 'USD',
  fulfillmentStatus: FulfillmentStatus.None,
  paypalOrderId: '5O190127TN364715T',
  shippingCents: 1500,
  buyerEmail: 'sam@example.com',
  buyerName: 'Sam Rivera',
  shippingAddress: {
    'address_line_1': '1 Main St',
    'admin_area_2': 'Springfield',
    'admin_area_1': 'IL',
    'postal_code': '62701',
    'country_code': 'US'
  },
  captureId: '3C679366HH908993F',
  carrier: 'USPS',
  trackingNumber: '9400111899223197428490',
  trackingSynced: false,
  downloads: 0,
  accessCode: 'K7QF-M2XP-9HTD',
  codeUses: 0,
  codeLastUsedAt: '2026-10-22T02:41:37Z',
  channel: Channel.Web,
  agent: 'Grok',
  refundId: '1JU08902781691411',
  refundedAt: '2026-10-22T02:41:37Z',
  options: {
    'Size': '9'
  },
  paidAt: '2026-10-22T02:41:37Z',
  createdAt: '2026-10-22T02:41:37Z',
};
```



