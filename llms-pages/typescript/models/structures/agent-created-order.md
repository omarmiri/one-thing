# Agent Created Order

Source: /#/typescript/x-redirect/JTI0bSUyRkFnZW50Q3JlYXRlZE9yZGVy

A new order, as `create_order` and `orderByLink` return it.


# Interface Name

`AgentCreatedOrder`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `orderId` | `string` | Required | - |
| `status` | `string` | Required, Constant | **Value**: `'awaiting_buyer_approval'` |
| `total` | `string` | Required | The total with shipping, as a label. |
| `options` | `Record<string, string> \| undefined` | Optional | The buyer's pick, one value per option, keyed by option name. |
| `payUrl` | `string` | Required | Where the buyer pays (redirects to PayPal). Safe to show in chat. |
| `statusUrl` | `string` | Required | `getAgentOrder` for this order. |
| `nextStep` | `string` | Required | - |


# Example

```ts
import { AgentCreatedOrder } from 'one-thing-sdk';

const agentCreatedOrder: AgentCreatedOrder = {
  orderId: 'order_id6',
  status: 'awaiting_buyer_approval',
  total: 'total8',
  payUrl: 'pay_url8',
  statusUrl: 'status_url0',
  nextStep: 'next_step0',
  options: {
    'Size': 'M',
    'Color': 'Black'
  },
};
```



