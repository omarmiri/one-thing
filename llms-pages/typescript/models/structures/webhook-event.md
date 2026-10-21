# Webhook Event

Source: /#/typescript/x-redirect/JTI0bSUyRldlYmhvb2tFdmVudA


# Interface Name

`WebhookEvent`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `string` | Required | PayPal's event id. |
| `eventType` | `string` | Required | - |
| `paypalOrderId` | `string \| null \| undefined` | Optional | - |
| `summary` | `string \| null \| undefined` | Optional | - |
| `verified` | `boolean` | Required | Whether PayPal confirmed the delivery's signature. |
| `outcome` | `string` | Required | - |
| `receivedAt` | `string` | Required | - |


# Example

```ts
import { WebhookEvent } from 'one-thing-sdk';

const webhookEvent: WebhookEvent = {
  id: 'id0',
  eventType: 'PAYMENT.CAPTURE.COMPLETED',
  verified: false,
  outcome: 'Confirmed: order already paid',
  receivedAt: '2016-03-13T12:52:32.123Z',
  paypalOrderId: 'paypal_order_id0',
  summary: '2.99 USD',
};
```



