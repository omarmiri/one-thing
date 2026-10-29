# List Webhook Events

Source: /#/python/x-redirect/JTI0ZSUyRk9yZGVycyUyRmxpc3RXZWJob29rRXZlbnRz

The last 50 PayPal webhook deliveries about this shop's orders, with signature results.

```python
def list_webhook_events(self,
                       slug)
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/python/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/python/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Template, Required | The shop's link name (current or former). |


# Response Type

**200**: Events, newest first.

[`List[WebhookEvent]`](/llms-pages/python/models/structures/webhook-event.md)


# Example Usage

```python
slug = 'vintageskates'

result = orders_api.list_webhook_events(slug)
print(result)
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
| 404 | No such shop, or the admin token or API key doesn't match it. | [`ErrorResponseException`](/llms-pages/python/models/exceptions/error-response.md) |



