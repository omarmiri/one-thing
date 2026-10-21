# List Orders

Source: /#/http/x-redirect/JTI0ZSUyRk9yZGVycyUyRmxpc3RPcmRlcnM

Newest first. Checkouts that were never approved are left out.

```http
GET /api/shops/{slug}/orders
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/http/getting-started/sdk-quickstart/authorization.md)


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
  --url 'https://one-thing-ash0.onrender.com/api/shops/raptorrush/orders'  \
  -H 'Accept: application/json' \
  -H 'x-admin-token: x-admin-token'
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | No such shop, or the admin token doesn't match it. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |



