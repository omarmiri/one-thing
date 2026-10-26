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
| `order_id` | `str` | Required | - |
| `status` | `str` | Required, Constant | **Value**: `"awaiting_buyer_approval"` |
| `total` | `str` | Required | The total with shipping, as a label. |
| `options` | `Dict[str, str]` | Optional | The buyer's pick, one value per option, keyed by option name. |
| `pay_url` | `str` | Required | Where the buyer pays (redirects to PayPal). Safe to show in chat. |
| `status_url` | `str` | Required | `getAgentOrder` for this order. |
| `next_step` | `str` | Required | - |


# Example

```python
from onethingapi.models.agent_created_order import AgentCreatedOrder

agent_created_order = AgentCreatedOrder(
    order_id='order_id6',
    total='total0',
    pay_url='pay_url6',
    status_url='status_url2',
    next_step='next_step8',
    show_buyer='show_buyer0',
    agent_name='agent_name8',
    options={
        'Size': 'M',
        'Color': 'Black'
    }
)
```



