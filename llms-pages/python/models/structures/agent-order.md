# Agent Order

Source: /#/python/x-redirect/JTI0bSUyRkFnZW50T3JkZXI

An order as `get_order` and `getAgentOrder` report it.


# Class Name

`AgentOrder`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `show_buyer` | `str` | Optional | A suggested reply to the buyer, in Markdown with the links already written as links: the product and its options to pick from, the pay link, or what they got with a receipt link. Buyers have the best experience when agents show it as written. |
| `agent_name` | `str` | Optional | Who this request was credited to in the seller's stats: a recognised user agent, else the name the agent gave itself (`?agent=`, or the MCP client's name), else the user agent's first word. |
| `order_id` | `str` | Required | - |
| `status` | [`Status2`](/llms-pages/python/models/enumerations/status-2.md) | Required | `declined`: PayPal declined it, nothing charged, the buyer can open `pay_url` again. `sold_out`: it sold out before the payment was captured. `expired`: the PayPal checkout expired; create a new order. `failed`: PayPal couldn't be reached; ask again. |
| `product` | `str` | Required | - |
| `options` | `Dict[str, str]` | Optional | The buyer's pick, one value per option, keyed by option name. |
| `amount` | [`Amount`](/llms-pages/python/models/structures/amount.md) | Required | - |
| `total` | `str` | Required | The total as a label, e.g. `$255.00`. |
| `pay_url` | `str` | Optional | Unpaid orders (waiting or declined). The buyer pays here; safe to show in chat. |
| `next_step` | `str` | Optional | Unpaid orders. What the agent should do next, in plain words. |
| `paid_at` | `datetime` | Optional | - |
| `receipt_url` | `str` | Optional | Paid orders. The buyer's thank-you page. |
| `delivery` | [AgentDeliveryAccessCode](/llms-pages/python/models/structures/agent-delivery-access-code.md) \| [AgentDeliveryDownload](/llms-pages/python/models/structures/agent-delivery-download.md) \| [AgentDeliveryShipping](/llms-pages/python/models/structures/agent-delivery-shipping.md) \| None | Optional | This is a container for one-of cases. |


# Example

```python
from onethingapi.models.agent_order import AgentOrder
from onethingapi.models.amount import Amount
from onethingapi.models.status_2 import Status2

agent_order = AgentOrder(
    order_id='order_id4',
    status=Status2.EXPIRED,
    product='product0',
    amount=Amount(
        item=175.9,
        shipping=226.72,
        total=71.32,
        currency='currency2'
    ),
    total='total0',
    show_buyer='show_buyer0',
    agent_name='agent_name8',
    options={
        'Size': 'M',
        'Color': 'Black'
    },
    pay_url='pay_url6',
    next_step='next_step8'
)
```



