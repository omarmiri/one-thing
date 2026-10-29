# Webhook Event

Source: /#/python/x-redirect/JTI0bSUyRldlYmhvb2tFdmVudA

A PayPal webhook delivery for this shop's orders.


# Class Name

`WebhookEvent`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `str` | Required | PayPal's event id. |
| `event_type` | `str` | Required | PayPal's event type. |
| `paypal_order_id` | `str` | Optional | The PayPal order it was about. |
| `summary` | `str` | Optional | The amount, or PayPal's summary. |
| `verified` | `bool` | Required | Whether PayPal confirmed the delivery's signature. |
| `outcome` | `str` | Required | What OneThing did with it. |
| `received_at` | `datetime` | Required | When it arrived. |


# Example

```python
import dateutil.parser

from onethingapi.models.webhook_event import WebhookEvent

webhook_event = WebhookEvent(
    id='WH-2WR32451HC0233532-67976317FL4543714',
    event_type='PAYMENT.CAPTURE.COMPLETED',
    verified=True,
    outcome='Confirmed: order already paid',
    received_at=dateutil.parser.parse('2026-10-22T02:41:37Z'),
    paypal_order_id='5O190127TN364715T',
    summary='2.99 USD'
)
```



