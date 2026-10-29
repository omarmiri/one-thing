# Webhook Event

Source: /#/typescript/x-redirect/JTI0bSUyRldlYmhvb2tFdmVudA

A PayPal webhook delivery for this shop's orders.


# Interface Name

`WebhookEvent`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `string` | Required | PayPal's event id. |
| `eventType` | `string` | Required | PayPal's event type. |
| `paypalOrderId` | `string \| null \| undefined` | Optional | The PayPal order it was about. |
| `summary` | `string \| null \| undefined` | Optional | The amount, or PayPal's summary. |
| `verified` | `boolean` | Required | Whether PayPal confirmed the delivery's signature. |
| `outcome` | `string` | Required | What OneThing did with it. |
| `receivedAt` | `string` | Required | When it arrived. |


# Example

```ts
import { WebhookEvent } from 'one-thing-sdk';

const webhookEvent: WebhookEvent = {
  id: 'WH-2WR32451HC0233532-67976317FL4543714',
  eventType: 'PAYMENT.CAPTURE.COMPLETED',
  verified: true,
  outcome: 'Confirmed: order already paid',
  receivedAt: '2026-10-22T02:41:37Z',
  paypalOrderId: '5O190127TN364715T',
  summary: '2.99 USD',
};
```



