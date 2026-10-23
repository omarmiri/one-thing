# Get Agent Order

Source: /#/python/x-redirect/JTI0ZSUyRkFnZW50cyUyRmdldEFnZW50T3JkZXI

Where an order stands and, once paid, what the buyer got: the access code, the download link, or the shipping address and tracking. The GET twin of the MCP `get_order` tool (and the `status_url` that `create_order` returns), for agents that can only fetch URLs. Public: anyone with the order id can already open its thank-you page. If the buyer has approved at PayPal but nothing has captured the payment yet, this captures it.

:information_source: **Note** This endpoint does not require authentication.

```python
def get_agent_order(self,
                   order_id)
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `order_id` | `str` | Template, Required | The `order_id` from the MCP `create_order` tool, or from a thank-you page link (`?order=`). |


# Response Type

**200**: The order.

[`AgentOrder`](/llms-pages/python/models/structures/agent-order.md)


# Example Usage

```python
order_id = 'pX4kR9tVb2nQ7sLe'

result = agents_api.get_agent_order(order_id)
print(result)
```


# Example Response *(as JSON)*

```json
{
  "order_id": "pX4kR9tVb2nQ7sLe",
  "status": "awaiting_buyer_approval",
  "product": "Vintage Cream and Red Roller Skates",
  "options": {
    "Size": "9"
  },
  "amount": {
    "item": 240,
    "shipping": 15,
    "total": 255,
    "currency": "USD"
  },
  "total": "$255.00",
  "pay_url": "https://one-thing-ash0.onrender.com/o/pX4kR9tVb2nQ7sLe",
  "next_step": "The buyer hasn't paid yet. Give them pay_url; when they say they've paid, call get_order again."
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | No order with that id. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |



