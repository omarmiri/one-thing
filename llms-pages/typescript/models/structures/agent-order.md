# Agent Order

Source: /#/typescript/x-redirect/JTI0bSUyRkFnZW50T3JkZXI

An order as `get_order` and `getAgentOrder` report it.


# Interface Name

`AgentOrder`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `showBuyer` | `string \| undefined` | Optional | A suggested reply to the buyer, in Markdown with the links already written as links: the product and its options to pick from, the pay link, or what they got with a receipt link. Buyers have the best experience when agents show it as written. |
| `agentName` | `string \| undefined` | Optional | Who this request was credited to in the seller's stats: a recognised user agent, else the name the agent gave itself (`?agent=`, or the MCP client's name), else the user agent's first word. |
| `orderId` | `string` | Required | The order's id. |
| `status` | [`Status2`](/llms-pages/typescript/models/enumerations/status-2.md) | Required | `declined`: PayPal declined it, nothing charged, the buyer can open `pay_url` again. `sold_out`: it sold out before the payment was captured. `expired`: the PayPal checkout expired; create a new order. `failed`: PayPal couldn't be reached; ask again. |
| `product` | `string` | Required | The product's name. |
| `options` | `Record<string, string> \| undefined` | Optional | The buyer's pick, one value per option, keyed by option name. |
| `amount` | [`Amount`](/llms-pages/typescript/models/structures/amount.md) | Required | What the order costs, as numbers. |
| `total` | `string` | Required | The total as a label, e.g. `$255.00`. |
| `payUrl` | `string \| undefined` | Optional | Unpaid orders (waiting or declined). The buyer pays here; safe to show in chat. |
| `nextStep` | `string \| undefined` | Optional | Unpaid orders. What the agent should do next, in plain words. |
| `paidAt` | `string \| undefined` | Optional | Paid orders. When PayPal captured the payment. |
| `receiptUrl` | `string \| undefined` | Optional | Paid orders. The buyer's thank-you page. |
| `delivery` | [`AgentOrderDelivery \| undefined`](/llms-pages/typescript/models/oneof-anyof-definitions/agent-order-delivery.md) | Optional | This is a container for one-of cases. |


# Example

```ts
import { AgentOrder, Status2 } from 'one-thing-sdk';

const agentOrder: AgentOrder = {
  orderId: 'pX4kR9tVb2nQ7sLe',
  status: Status2.AwaitingBuyerApproval,
  product: 'Vintage Cream and Red Roller Skates',
  amount: {
    item: 240,
    shipping: 15,
    total: 255,
    currency: 'USD',
  },
  total: '$255.00',
  showBuyer: '![Vintage Cream and Red Roller Skates](https://one-thing-ash0.onrender.com/api/blobs/LFRvGuTU3D8i334X)\n\n**Vintage Cream and Red Roller Skates**: $240.00. Classic quad skates crafted with walnut burl heels\n\n![Raptor Rush: Browser Edition](https://one-thing-ash0.onrender.com/api/blobs/R9tWc3yN6bJq1zUd)\n\n**Raptor Rush: Browser Edition**: $2.99. Grow from Tiny Hatchling to Giant Apex Predator\n\nWhich one?',
  agentName: 'Grok',
  options: {
    'Size': 'M',
    'Color': 'Black'
  },
  payUrl: 'https://one-thing-ash0.onrender.com/o/pX4kR9tVb2nQ7sLe',
  nextStep: 'Show pay_url to the buyer as a link. When they say they\'ve paid, call get_order with order_id.',
  paidAt: '2026-10-22T02:41:37Z',
  receiptUrl: 'https://one-thing-ash0.onrender.com/vintageskates/thanks?order=pX4kR9tVb2nQ7sLe',
  delivery: {
    type: 'access_code',
    accessCode: 'K7QF-M2XP-9HTD',
    startUrl: 'https://www.miriogames.com/raptor-rush/?code=K7QF-M2XP-9HTD',
  },
};
```



