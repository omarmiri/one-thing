# Agent Order

Source: /#/typescript/x-redirect/JTI0bSUyRkFnZW50T3JkZXI

An order as `get_order` and `getAgentOrder` report it.


# Interface Name

`AgentOrder`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `orderId` | `string` | Required | - |
| `status` | [`Status2`](/llms-pages/typescript/models/enumerations/status-2.md) | Required | `declined`: PayPal declined it, nothing charged, the buyer can open `pay_url` again. `sold_out`: it sold out before the payment was captured. `expired`: the PayPal checkout expired; create a new order. `failed`: PayPal couldn't be reached; ask again. |
| `product` | `string` | Required | - |
| `options` | `Record<string, string> \| undefined` | Optional | The buyer's pick, one value per option, keyed by option name. |
| `amount` | [`Amount`](/llms-pages/typescript/models/structures/amount.md) | Required | - |
| `total` | `string` | Required | The total as a label, e.g. `$255.00`. |
| `payUrl` | `string \| undefined` | Optional | Unpaid orders (waiting or declined). The buyer pays here; safe to show in chat. |
| `nextStep` | `string \| undefined` | Optional | Unpaid orders. What the agent should do next, in plain words. |
| `paidAt` | `string \| undefined` | Optional | - |
| `receiptUrl` | `string \| undefined` | Optional | Paid orders. The buyer's thank-you page. |
| `delivery` | [`AgentOrderDelivery \| undefined`](/llms-pages/typescript/models/oneof-anyof-definitions/agent-order-delivery.md) | Optional | This is a container for one-of cases. |


# Example

```ts
import { AgentOrder, Status2 } from 'one-thing-sdk';

const agentOrder: AgentOrder = {
  orderId: 'order_id8',
  status: Status2.AwaitingBuyerApproval,
  product: 'product4',
  amount: {
    item: 175.9,
    shipping: 226.72,
    total: 71.32,
    currency: 'currency2',
  },
  total: 'total4',
  options: {
    'Size': 'M',
    'Color': 'Black'
  },
  payUrl: 'pay_url0',
  nextStep: 'next_step2',
  paidAt: '2016-03-13T12:52:32.123Z',
  receiptUrl: 'receipt_url6',
};
```



