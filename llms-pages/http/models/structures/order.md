# Order

Source: /#/http/x-redirect/JTI0bSUyRk9yZGVy


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `String` | Required | - |
| `paypal_order_id` | `String` | Optional | - |
| `status` | [`Status 2`](/llms-pages/http/models/enumerations/status-2.md) | Required | - |
| `amount_cents` | `Number` | Required | - |
| `shipping_cents` | `Number` | Optional | - |
| `currency` | `String` | Required | - |
| `buyer_email` | `String` | Optional | - |
| `buyer_name` | `String` | Optional | - |
| `shipping_address` | `map<String>` | Optional | - |
| `capture_id` | `String` | Optional | - |
| `fulfillment_status` | [`Fulfillment Status`](/llms-pages/http/models/enumerations/fulfillment-status.md) | Required | - |
| `carrier` | `String` | Optional | - |
| `tracking_number` | `String` | Optional | - |
| `tracking_synced` | `Boolean` | Optional | - |
| `downloads` | `Number` | Optional | - |
| `access_code` | `String` | Optional | - |
| `code_uses` | `Number` | Optional | - |
| `paid_at` | `DateTime` | Optional | - |
| `created_at` | `DateTime` | Optional | - |


# Example (as JSON)

```json
{
  "id": "id2",
  "paypal_order_id": "paypal_order_id2",
  "status": "created",
  "amount_cents": 124,
  "shipping_cents": 70,
  "currency": "currency2",
  "buyer_email": "buyer_email6",
  "buyer_name": "buyer_name0",
  "shipping_address": {
    "key0": "shipping_address2",
    "key1": "shipping_address1",
    "key2": "shipping_address0"
  },
  "fulfillment_status": "none"
}
```



