# Order 1

Source: /#/python/x-redirect/JTI0bSUyRk9yZGVyMQ

The order.


# Class Name

`Order1`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `str` | Optional | OneThing's order id. |
| `paypal_order_id` | `str` | Optional | PayPal's order id. |
| `amount` | `str` | Optional | The total, as a decimal string. |
| `currency` | `str` | Optional | ISO 4217 currency code. |
| `buyer_name` | `str` | Optional | The buyer's name, from PayPal. |
| `buyer_email` | `str` | Optional | The buyer's email, from PayPal. |
| `shipping_address` | `Any` | Optional | Physical orders: the address, by field. |
| `fulfillment_status` | `str` | Optional | As in `Order.fulfillment_status`. |
| `tracking_number` | `str` | Optional | The tracking number, once shipped. |
| `carrier` | `str` | Optional | The carrier, once shipped. |


# Example

```python
import jsonpickle

from onethingapi.models.order_1 import Order1

order_1 = Order1(
    id='pX4kR9tVb2nQ7sLe',
    paypal_order_id='5O190127TN364715T',
    amount='255.00',
    currency='USD',
    buyer_name='Sam Rivera',
    buyer_email='sam@example.com',
    shipping_address=jsonpickle.decode('{"address_line_1":"1 Main St","admin_area_2":"Springfield","admin_area_1":"IL","postal_code":"62701","country_code":"US"}'),
    fulfillment_status='to_ship',
    tracking_number='9400111899223197428490',
    carrier='USPS'
)
```



