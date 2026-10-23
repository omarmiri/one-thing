# List Webhook Events

Source: /#/http/x-redirect/JTI0ZSUyRk9yZGVycyUyRmxpc3RXZWJob29rRXZlbnRz

The last 50 PayPal webhook deliveries about this shop's orders, with signature results.

```http
GET /api/shops/{slug}/webhooks
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/http/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/http/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Template, Required | The shop's link name (current or former). |


# Response Type

**200**: Events, newest first.

[`array<Webhook Event>`](/llms-pages/http/models/structures/webhook-event.md)


# Example Usage

```bash
curl -X GET \
  --url 'https://one-thing-ash0.onrender.com/api/shops/raptorrush/webhooks'  \
  -H 'Accept: application/json' \
  -H 'x-admin-token: x-admin-token' \
  -H 'Authorization: Bearer AccessToken'
```


# Example Response *(as JSON)*

```json
[
  {
    "id": "WH-2WR32451HC0233532-67976317FL4543714",
    "event_type": "PAYMENT.CAPTURE.COMPLETED",
    "paypal_order_id": "5O190127TN364715T",
    "summary": "255.00 USD",
    "verified": true,
    "outcome": "Confirmed: order already paid",
    "received_at": "2026-10-22T02:41:40Z"
  }
]
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |



