# Agent Created Order

Source: /#/python/x-redirect/JTI0bSUyRkFnZW50Q3JlYXRlZE9yZGVy

A new order, as `create_order` and `orderByLink` return it.


# Class Name

`AgentCreatedOrder`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `show_buyer` | `str` | Optional | A suggested reply to the buyer, in Markdown with the links already written as links: the product and its options to pick from, the pay link, or what they got with a receipt link. Buyers have the best experience when agents show it as written. |
| `agent_name` | `str` | Optional | Who this request was credited to in the seller's stats: a recognised user agent, else the name the agent gave itself (`?agent=`, or the MCP client's name), else the user agent's first word. |
| `order_id` | `str` | Required | The order's id, for `get_order` and `getAgentOrder`. |
| `status` | `str` | Required, Constant | Always `awaiting_buyer_approval`: nothing is charged until the buyer approves at PayPal.<br><br>**Value**: `"awaiting_buyer_approval"` |
| `total` | `str` | Required | The total with shipping, as a label. |
| `options` | `Dict[str, str]` | Optional | The buyer's pick, one value per option, keyed by option name. |
| `pay_url` | `str` | Required | Where the buyer pays (redirects to PayPal). Safe to show in chat. |
| `status_url` | `str` | Required | `getAgentOrder` for this order. |
| `next_step` | `str` | Required | What the agent should do next, in plain words: show `pay_url`, then check `status_url` once the buyer says they've paid. |


# Example

```python
from onethingapi.models.agent_created_order import AgentCreatedOrder

agent_created_order = AgentCreatedOrder(
    order_id='pX4kR9tVb2nQ7sLe',
    total='$255.00',
    pay_url='https://one-thing-ash0.onrender.com/o/pX4kR9tVb2nQ7sLe',
    status_url='https://one-thing-ash0.onrender.com/o/pX4kR9tVb2nQ7sLe/status',
    next_step='Show pay_url to the buyer as a link. When they say they\'ve paid, call get_order with order_id.',
    show_buyer='![Vintage Cream and Red Roller Skates](https://one-thing-ash0.onrender.com/api/blobs/LFRvGuTU3D8i334X)\n\n**Vintage Cream and Red Roller Skates**: $240.00. Classic quad skates crafted with walnut burl heels\n\n![Raptor Rush: Browser Edition](https://one-thing-ash0.onrender.com/api/blobs/R9tWc3yN6bJq1zUd)\n\n**Raptor Rush: Browser Edition**: $2.99. Grow from Tiny Hatchling to Giant Apex Predator\n\nWhich one?',
    agent_name='Grok',
    options={
        'Size': 'M',
        'Color': 'Black'
    }
)
```



