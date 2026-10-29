# List Orders

Source: /#/http/x-redirect/JTI0ZSUyRk9yZGVycyUyRmxpc3RPcmRlcnM

Newest first. Checkouts that were never approved are left out.

```http
GET /api/shops/{slug}/orders
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/http/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/http/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Template, Required | The shop's link name (current or former). |


# Response Type

**200**: Orders.

[`array<Order>`](/llms-pages/http/models/structures/order.md)


# Example Usage

```bash
curl -X GET \
  --url 'https://one-thing-ash0.onrender.com/api/shops/vintageskates/orders'  \
  -H 'Accept: application/json' \
  -H 'x-admin-token: x-admin-token' \
  -H 'Authorization: Bearer AccessToken'
```


# Example Response *(as JSON)*

```json
[
  {
    "id": "pX4kR9tVb2nQ7sLe",
    "paypal_order_id": "5O190127TN364715T",
    "status": "paid",
    "amount_cents": 25500,
    "shipping_cents": 1500,
    "currency": "USD",
    "buyer_email": "buyer@example.com",
    "buyer_name": "Sam Rivera",
    "shipping_address": {
      "address_line_1": "1 Main St",
      "admin_area_2": "Springfield",
      "admin_area_1": "IL",
      "postal_code": "62701",
      "country_code": "US"
    },
    "capture_id": "3C679366HH908993F",
    "fulfillment_status": "to_ship",
    "carrier": null,
    "tracking_number": null,
    "tracking_synced": false,
    "downloads": 0,
    "access_code": null,
    "code_uses": 0,
    "channel": "agent",
    "options": {
      "Size": "8"
    },
    "paid_at": "2026-10-22T02:41:37Z",
    "created_at": "2026-10-22T02:38:05Z"
  }
]
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`ErrorResponse_ErrorException`](/llms-pages/http/models/exceptions/error-response-error.md) |



