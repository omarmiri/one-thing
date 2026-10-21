# List Webhook Events

Source: /#/python/x-redirect/JTI0ZSUyRk9yZGVycyUyRmxpc3RXZWJob29rRXZlbnRz

The last 50 PayPal webhook deliveries about this shop's orders, with signature results.

```python
def list_webhook_events(self,
                       slug)
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/python/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Template, Required | The shop's link name (current or former). |


# Response Type

**200**: Events, newest first.

[`List[WebhookEvent]`](/llms-pages/python/models/structures/webhook-event.md)


# Example Usage

```python
slug = 'raptorrush'

result = orders_api.list_webhook_events(slug)
print(result)
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | No such shop, or the admin token doesn't match it. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |



