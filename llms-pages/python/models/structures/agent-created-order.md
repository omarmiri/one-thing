# Agent Created Order

Source: /#/python/x-redirect/JTI0bSUyRkFnZW50Q3JlYXRlZE9yZGVy

A new order, as `create_order` and `orderByLink` return it.


# Class Name

`AgentCreatedOrder`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
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
    options={
        'Size': 'M',
        'Color': 'Black'
    }
)
```



