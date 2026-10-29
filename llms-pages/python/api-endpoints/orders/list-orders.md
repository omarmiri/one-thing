# List Orders

Source: /#/python/x-redirect/JTI0ZSUyRk9yZGVycyUyRmxpc3RPcmRlcnM

Newest first. Checkouts that were never approved are left out.

```python
def list_orders(self,
               slug)
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/python/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/python/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Template, Required | The shop's link name (current or former). |


# Response Type

**200**: Orders.

[`List[Order]`](/llms-pages/python/models/structures/order.md)


# Example Usage

```python
slug = 'vintageskates'

result = orders_api.list_orders(slug)
print(result)
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
| 404 | No such shop, or the admin token or API key doesn't match it. | [`ErrorResponseException`](/llms-pages/python/models/exceptions/error-response.md) |



