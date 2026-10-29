# Refund Order

Source: /#/http/x-redirect/JTI0ZSUyRk9yZGVycyUyRnJlZnVuZE9yZGVy

Refunds the whole payment through PayPal and marks the order `refunded`. When PayPal only lets the paid account refund it (the money went to a PayPal email the seller typed in, not a connected account), the reply is a 409 with `refundInPayPal: true`. Refund it in your PayPal account, then call this again with `{"record": true}`, which only marks it refunded here. Sends the `order.refunded` event to the shop's Zapier hook.

```http
POST /api/shops/{slug}/orders/{orderId}/refund
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/http/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/http/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Template, Required | The shop's link name (current or former). |
| `orderId` | `String` | Template, Required | OneThing's order id (`Order.id`). |
| `body` | [`Api Shops Orders Refund Request`](/llms-pages/http/models/structures/api-shops-orders-refund-request.md) | Body, Optional | Optional. `record: true` records a refund made in PayPal. |


# Response Type

**200**: Refunded.

[`Api Shops Orders Refund Response`](/llms-pages/http/models/structures/api-shops-orders-refund-response.md)


# Example Usage

```bash
curl -X POST \
  --url 'https://one-thing-ash0.onrender.com/api/shops/vintageskates/orders/pX4kR9tVb2nQ7sLe/refund'  \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'x-admin-token: x-admin-token' \
  -H 'Authorization: Bearer AccessToken' \
  --data-raw '{}'
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
| 404 | No such shop or order, or the token doesn't match the shop. | [`ErrorResponse_ErrorException`](/llms-pages/http/models/exceptions/error-response-error.md) |
| 409 | Not refundable here; `error` says why. | [`Api Shops Orders Refund 409 ErrorException`](/llms-pages/http/models/exceptions/api-shops-orders-refund-409-error.md) |



