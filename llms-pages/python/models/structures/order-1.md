# Order 1

Source: /#/python/x-redirect/JTI0bSUyRk9yZGVyMQ


# Class Name

`Order1`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `str` | Optional | - |
| `paypal_order_id` | `str` | Optional | - |
| `amount` | `str` | Optional | - |
| `currency` | `str` | Optional | - |
| `buyer_name` | `str` | Optional | - |
| `buyer_email` | `str` | Optional | - |
| `shipping_address` | `Any` | Optional | - |
| `fulfillment_status` | `str` | Optional | - |
| `tracking_number` | `str` | Optional | - |
| `carrier` | `str` | Optional | - |


# Example

```python
from onethingapi.models.order_1 import Order1

order_1 = Order1(
    id='id0',
    paypal_order_id='paypal_order_id0',
    amount='2.99',
    currency='currency0',
    buyer_name='buyer_name8'
)
```



