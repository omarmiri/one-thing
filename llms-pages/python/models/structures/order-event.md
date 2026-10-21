# Order Event

Source: /#/python/x-redirect/JTI0bSUyRk9yZGVyRXZlbnQ


# Class Name

`OrderEvent`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `event` | [`Event`](/llms-pages/python/models/enumerations/event.md) | Required | - |
| `shop` | [`Shop1`](/llms-pages/python/models/structures/shop-1.md) | Required | - |
| `order` | [`Order1`](/llms-pages/python/models/structures/order-1.md) | Required | - |


# Example

```python
from onethingapi.models.event import Event
from onethingapi.models.order_1 import Order1
from onethingapi.models.order_event import OrderEvent
from onethingapi.models.shop_1 import Shop1

order_event = OrderEvent(
    event=Event.ENUM_ORDERPAID,
    shop=Shop1(
        slug='slug4',
        name='name0',
        url='url4'
    ),
    order=Order1(
        id='id6',
        paypal_order_id='paypal_order_id6',
        amount='2.99',
        currency='currency6',
        buyer_name='buyer_name4'
    )
)
```



