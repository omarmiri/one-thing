# Agent Order

Source: /#/http/x-redirect/JTI0bSUyRkFnZW50T3JkZXI

An order as `get_order` and `getAgentOrder` report it.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `show_buyer` | `String` | Optional | A suggested reply to the buyer, in Markdown with the links already written as links: the product and its options to pick from, the pay link, or what they got with a receipt link. Buyers have the best experience when agents show it as written. |
| `agent_name` | `String` | Optional | Who this request was credited to in the seller's stats: a recognised user agent, else the name the agent gave itself (`?agent=`, or the MCP client's name), else the user agent's first word. |
| `order_id` | `String` | Required | - |
| `status` | [`Status 2`](/llms-pages/http/models/enumerations/status-2.md) | Required | `declined`: PayPal declined it, nothing charged, the buyer can open `pay_url` again. `sold_out`: it sold out before the payment was captured. `expired`: the PayPal checkout expired; create a new order. `failed`: PayPal couldn't be reached; ask again. |
| `product` | `String` | Required | - |
| `options` | `map<String>` | Optional | The buyer's pick, one value per option, keyed by option name. |
| `amount` | [`Amount`](/llms-pages/http/models/structures/amount.md) | Required | - |
| `total` | `String` | Required | The total as a label, e.g. `$255.00`. |
| `pay_url` | `String` | Optional | Unpaid orders (waiting or declined). The buyer pays here; safe to show in chat. |
| `next_step` | `String` | Optional | Unpaid orders. What the agent should do next, in plain words. |
| `paid_at` | `DateTime` | Optional | - |
| `receipt_url` | `String` | Optional | Paid orders. The buyer's thank-you page. |
| `delivery` | [`Agent Delivery Access Code \| Agent Delivery Download \| Agent Delivery Shipping`](/llms-pages/http/models/oneof-anyof-definitions/agent-order-delivery.md) | Optional | Paid orders. What the buyer got. |


# Example (as JSON)

```json
{
  "order_id": "order_id0",
  "status": "declined",
  "product": "product6",
  "options": {
    "Size": "M",
    "Color": "Black"
  },
  "amount": {
    "item": 175.9,
    "shipping": 226.72,
    "total": 71.32,
    "currency": "currency2"
  },
  "total": "total6",
  "show_buyer": "show_buyer6",
  "agent_name": "agent_name4",
  "pay_url": "pay_url2",
  "next_step": "next_step4"
}
```



