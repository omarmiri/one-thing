# Order 1

Source: /#/http/x-redirect/JTI0bSUyRk9yZGVyMQ

The order.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `String` | Optional | OneThing's order id. |
| `paypal_order_id` | `String` | Optional | PayPal's order id. |
| `amount` | `String` | Optional | The total, as a decimal string. |
| `currency` | `String` | Optional | ISO 4217 currency code. |
| `buyer_name` | `String` | Optional | The buyer's name, from PayPal. |
| `buyer_email` | `String` | Optional | The buyer's email, from PayPal. |
| `shipping_address` | `Object` | Optional | Physical orders: the address, by field. |
| `fulfillment_status` | `String` | Optional | As in `Order.fulfillment_status`. |
| `tracking_number` | `String` | Optional | The tracking number, once shipped. |
| `carrier` | `String` | Optional | The carrier, once shipped. |


# Example (as JSON)

```json
{
  "id": "pX4kR9tVb2nQ7sLe",
  "paypal_order_id": "5O190127TN364715T",
  "amount": "255.00",
  "currency": "USD",
  "buyer_name": "Sam Rivera",
  "buyer_email": "sam@example.com",
  "shipping_address": {
    "address_line_1": "1 Main St",
    "admin_area_2": "Springfield",
    "admin_area_1": "IL",
    "postal_code": "62701",
    "country_code": "US"
  },
  "fulfillment_status": "to_ship",
  "tracking_number": "9400111899223197428490",
  "carrier": "USPS"
}
```



