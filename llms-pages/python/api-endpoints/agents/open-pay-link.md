# Open Pay Link

Source: /#/python/x-redirect/JTI0ZSUyRkFnZW50cyUyRm9wZW5QYXlMaW5r

The `pay_url` an agent gives the buyer. It redirects to PayPal's payment page for the order, so PayPal's checkout token never passes through the agent (agent platforms hide such tokens as secrets). A paid order redirects to its thank-you page; an expired checkout goes back to the shop page.

:information_source: **Note** This endpoint does not require authentication.

```python
def open_pay_link(self,
                 order_id)
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `order_id` | `str` | Template, Required | The `order_id` from the MCP `create_order` tool. |


# Response Type

**200**

`void`


# Example Usage

```python
order_id = 'pX4kR9tVb2nQ7sLe'

agents_api.open_pay_link(order_id)
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | No order with that id. | `ApiException` |



