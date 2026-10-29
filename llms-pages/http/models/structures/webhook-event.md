# Webhook Event

Source: /#/http/x-redirect/JTI0bSUyRldlYmhvb2tFdmVudA

A PayPal webhook delivery for this shop's orders.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `String` | Required | PayPal's event id. |
| `event_type` | `String` | Required | PayPal's event type. |
| `paypal_order_id` | `String` | Optional | The PayPal order it was about. |
| `summary` | `String` | Optional | The amount, or PayPal's summary. |
| `verified` | `Boolean` | Required | Whether PayPal confirmed the delivery's signature. |
| `outcome` | `String` | Required | What OneThing did with it. |
| `received_at` | `DateTime` | Required | When it arrived. |


# Example (as JSON)

```json
{
  "id": "WH-2WR32451HC0233532-67976317FL4543714",
  "event_type": "PAYMENT.CAPTURE.COMPLETED",
  "paypal_order_id": "5O190127TN364715T",
  "summary": "2.99 USD",
  "verified": true,
  "outcome": "Confirmed: order already paid",
  "received_at": "2026-10-22T02:41:37Z"
}
```



