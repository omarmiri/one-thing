# Agent Created Order

Source: /#/http/x-redirect/JTI0bSUyRkFnZW50Q3JlYXRlZE9yZGVy

A new order, as `create_order` and `orderByLink` return it.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `order_id` | `String` | Required | - |
| `status` | `String` | Required, Constant | **Value**: `awaiting_buyer_approval` |
| `total` | `String` | Required | The total with shipping, as a label. |
| `options` | `map<String>` | Optional | The buyer's pick, one value per option, keyed by option name. |
| `pay_url` | `String` | Required | Where the buyer pays (redirects to PayPal). Safe to show in chat. |
| `status_url` | `String` | Required | `getAgentOrder` for this order. |
| `next_step` | `String` | Required | - |


# Example (as JSON)

```json
{
  "order_id": "order_id2",
  "status": "awaiting_buyer_approval",
  "total": "total2",
  "options": {
    "Size": "M",
    "Color": "Black"
  },
  "pay_url": "pay_url4",
  "status_url": "status_url4",
  "next_step": "next_step6"
}
```



