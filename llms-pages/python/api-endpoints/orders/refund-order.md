# Refund Order

Source: /#/python/x-redirect/JTI0ZSUyRk9yZGVycyUyRnJlZnVuZE9yZGVy

Refunds the whole payment through PayPal and marks the order `refunded`. When PayPal only lets the paid account refund it (the money went to a PayPal email the seller typed in, not a connected account), the reply is a 409 with `refundInPayPal: true`. Refund it in your PayPal account, then call this again with `{"record": true}`, which only marks it refunded here. Sends the `order.refunded` event to the shop's Zapier hook.

```python
def refund_order(self,
                slug,
                order_id,
                body=None)
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/python/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/python/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Template, Required | The shop's link name (current or former). |
| `order_id` | `str` | Template, Required | OneThing's order id (`Order.id`). |
| `body` | [`ApiShopsOrdersRefundRequest`](/llms-pages/python/models/structures/api-shops-orders-refund-request.md) | Body, Optional | Optional. `record: true` records a refund made in PayPal. |


# Response Type

**200**: Refunded.

[`ApiShopsOrdersRefundResponse`](/llms-pages/python/models/structures/api-shops-orders-refund-response.md)


# Example Usage

```python
slug = 'vintageskates'

order_id = 'pX4kR9tVb2nQ7sLe'

body = ApiShopsOrdersRefundRequest()

result = orders_api.refund_order(
    slug,
    order_id,
    body=body
)
print(result)
```


# Example Response *(as JSON)*

```json
{
  "ok": true,
  "refundId": "1JU08902781691411"
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | No such shop or order, or the token doesn't match the shop. | [`ErrorResponseException`](/llms-pages/python/models/exceptions/error-response.md) |
| 409 | Not refundable here; `error` says why. | [`ApiShopsOrdersRefund409ErrorException`](/llms-pages/python/models/exceptions/api-shops-orders-refund-409-error.md) |



