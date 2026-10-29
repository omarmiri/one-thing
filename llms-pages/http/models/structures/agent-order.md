# Agent Order

Source: /#/http/x-redirect/JTI0bSUyRkFnZW50T3JkZXI

An order as `get_order` and `getAgentOrder` report it.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `show_buyer` | `String` | Optional | A suggested reply to the buyer, in Markdown with the links already written as links: the product and its options to pick from, the pay link, or what they got with a receipt link. Buyers have the best experience when agents show it as written. |
| `agent_name` | `String` | Optional | Who this request was credited to in the seller's stats: a recognised user agent, else the name the agent gave itself (`?agent=`, or the MCP client's name), else the user agent's first word. |
| `order_id` | `String` | Required | The order's id. |
| `status` | [`Status 2`](/llms-pages/http/models/enumerations/status-2.md) | Required | `declined`: PayPal declined it, nothing charged, the buyer can open `pay_url` again. `sold_out`: it sold out before the payment was captured. `expired`: the PayPal checkout expired; create a new order. `failed`: PayPal couldn't be reached; ask again. |
| `product` | `String` | Required | The product's name. |
| `options` | `map<String>` | Optional | The buyer's pick, one value per option, keyed by option name. |
| `amount` | [`Amount`](/llms-pages/http/models/structures/amount.md) | Required | What the order costs, as numbers. |
| `total` | `String` | Required | The total as a label, e.g. `$255.00`. |
| `pay_url` | `String` | Optional | Unpaid orders (waiting or declined). The buyer pays here; safe to show in chat. |
| `next_step` | `String` | Optional | Unpaid orders. What the agent should do next, in plain words. |
| `paid_at` | `DateTime` | Optional | Paid orders. When PayPal captured the payment. |
| `receipt_url` | `String` | Optional | Paid orders. The buyer's thank-you page. |
| `delivery` | [`Agent Delivery Access Code \| Agent Delivery Download \| Agent Delivery Shipping`](/llms-pages/http/models/oneof-anyof-definitions/agent-order-delivery.md) | Optional | Paid orders. What the buyer got. |


# Example (as JSON)

```json
{
  "show_buyer": "![Vintage Cream and Red Roller Skates](https://one-thing-ash0.onrender.com/api/blobs/LFRvGuTU3D8i334X)\n\n**Vintage Cream and Red Roller Skates**: $240.00. Classic quad skates crafted with walnut burl heels\n\n![Raptor Rush: Browser Edition](https://one-thing-ash0.onrender.com/api/blobs/R9tWc3yN6bJq1zUd)\n\n**Raptor Rush: Browser Edition**: $2.99. Grow from Tiny Hatchling to Giant Apex Predator\n\nWhich one?",
  "agent_name": "Grok",
  "order_id": "pX4kR9tVb2nQ7sLe",
  "status": "awaiting_buyer_approval",
  "product": "Vintage Cream and Red Roller Skates",
  "options": {
    "Size": "M",
    "Color": "Black"
  },
  "amount": {
    "item": 240,
    "shipping": 15,
    "total": 255,
    "currency": "USD"
  },
  "total": "$255.00",
  "pay_url": "https://one-thing-ash0.onrender.com/o/pX4kR9tVb2nQ7sLe",
  "next_step": "Show pay_url to the buyer as a link. When they say they've paid, call get_order with order_id.",
  "paid_at": "2026-10-22T02:41:37Z",
  "receipt_url": "https://one-thing-ash0.onrender.com/vintageskates/thanks?order=pX4kR9tVb2nQ7sLe",
  "delivery": {
    "type": "access_code",
    "access_code": "K7QF-M2XP-9HTD",
    "start_url": "https://www.miriogames.com/raptor-rush/?code=K7QF-M2XP-9HTD"
  }
}
```



