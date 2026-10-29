# Order Event

Source: /#/http/x-redirect/JTI0bSUyRk9yZGVyRXZlbnQ


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `event` | [`Event`](/llms-pages/http/models/enumerations/event.md) | Required | - |
| `shop` | [`Shop 1`](/llms-pages/http/models/structures/shop-1.md) | Required | - |
| `order` | [`Order 1`](/llms-pages/http/models/structures/order-1.md) | Required | - |


# Example (as JSON)

```json
{
  "event": "order.shipped",
  "shop": {
    "slug": "slug4",
    "name": "name0",
    "url": "url4"
  },
  "order": {
    "amount": "2.99",
    "id": "id6",
    "paypal_order_id": "paypal_order_id6",
    "currency": "currency6",
    "buyer_name": "buyer_name4"
  }
}
```



