# Agent Created Order

Source: /#/typescript/x-redirect/JTI0bSUyRkFnZW50Q3JlYXRlZE9yZGVy

A new order, as `create_order` and `orderByLink` return it.


# Interface Name

`AgentCreatedOrder`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `showBuyer` | `string \| undefined` | Optional | A suggested reply to the buyer, in Markdown with the links already written as links: the product and its options to pick from, the pay link, or what they got with a receipt link. Buyers have the best experience when agents show it as written. |
| `agentName` | `string \| undefined` | Optional | Who this request was credited to in the seller's stats: a recognised user agent, else the name the agent gave itself (`?agent=`, or the MCP client's name), else the user agent's first word. |
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
  showBuyer: 'show_buyer8',
  agentName: 'agent_name0',
  options: {
    'Size': 'M',
    'Color': 'Black'
  },
};
```



