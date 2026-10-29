# Order Event

Source: /#/http/x-redirect/JTI0bSUyRk9yZGVyRXZlbnQ

What OneThing posts to the seller's Zapier hook.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `event` | [`Event`](/llms-pages/http/models/enumerations/event.md) | Required | What happened. |
| `shop` | [`Shop 1`](/llms-pages/http/models/structures/shop-1.md) | Required | The shop the order belongs to. |
| `order` | [`Order 1`](/llms-pages/http/models/structures/order-1.md) | Required | The order. |


# Example (as JSON)

```json
{
  "event": "order.paid",
  "shop": {
    "slug": "vintageskates",
    "name": "Vintage Cream and Red Roller Skates",
    "url": "https://one-thing-ash0.onrender.com/vintageskates"
  },
  "order": {
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
}
```



