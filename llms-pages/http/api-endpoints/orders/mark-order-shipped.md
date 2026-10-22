# Mark Order Shipped

Source: /#/http/x-redirect/JTI0ZSUyRk9yZGVycyUyRm1hcmtPcmRlclNoaXBwZWQ

Saves the tracking number and pushes it to PayPal, so the buyer sees it in PayPal.

```http
POST /api/shops/{slug}/orders/{orderId}/ship
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/http/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/http/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Template, Required | The shop's link name (current or former). |
| `orderId` | `String` | Template, Required | OneThing's order id (`Order.id`). |
| `body` | [`Api Shops Orders Ship Request`](/llms-pages/http/models/structures/api-shops-orders-ship-request.md) | Body, Required | - |


# Response Type

**200**: Shipped.

[`Api Shops Orders Ship Response`](/llms-pages/http/models/structures/api-shops-orders-ship-response.md)


# Example Usage

```bash
curl -X POST \
  --url 'https://one-thing-ash0.onrender.com/api/shops/raptorrush/orders/orderId2/ship'  \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'x-admin-token: x-admin-token' \
  -H 'Authorization: Bearer AccessToken' \
  --data-raw '{
  "carrier": "DHL",
  "trackingNumber": "trackingNumber4"
}'
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |



