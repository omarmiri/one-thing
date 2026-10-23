# Open Pay Link

Source: /#/http/x-redirect/JTI0ZSUyRkFnZW50cyUyRm9wZW5QYXlMaW5r

The `pay_url` an agent gives the buyer. It redirects to PayPal's payment page for the order, so PayPal's checkout token never passes through the agent (agent platforms hide such tokens as secrets). A paid order redirects to its thank-you page; an expired checkout goes back to the shop page.

:information_source: **Note** This endpoint does not require authentication.

```http
GET /o/{orderId}
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `orderId` | `String` | Template, Required | The `order_id` from the MCP `create_order` tool. |


# Response Type

**303**: Redirect to PayPal, the thank-you page or the shop page.

`Void`


# Example Usage

```bash
curl -X GET \
  --url 'https://one-thing-ash0.onrender.com/o/pX4kR9tVb2nQ7sLe'
```


# Errors

| HTTP Status Code | Error Description |
|  --- | --- |
| 404 | No order with that id. |



