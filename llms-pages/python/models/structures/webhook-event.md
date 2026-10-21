# Webhook Event

Source: /#/python/x-redirect/JTI0bSUyRldlYmhvb2tFdmVudA


# Class Name

`WebhookEvent`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `str` | Required | PayPal's event id. |
| `event_type` | `str` | Required | - |
| `paypal_order_id` | `str` | Optional | - |
| `summary` | `str` | Optional | - |
| `verified` | `bool` | Required | Whether PayPal confirmed the delivery's signature. |
| `outcome` | `str` | Required | - |
| `received_at` | `datetime` | Required | - |


# Example

```python
import dateutil.parser

from onethingapi.models.webhook_event import WebhookEvent

webhook_event = WebhookEvent(
    id='id2',
    event_type='PAYMENT.CAPTURE.COMPLETED',
    verified=False,
    outcome='Confirmed: order already paid',
    received_at=dateutil.parser.parse('2016-03-13T12:52:32.123Z'),
    paypal_order_id='paypal_order_id2',
    summary='2.99 USD'
)
```



