# Webhook Event

Source: /#/http/x-redirect/JTI0bSUyRldlYmhvb2tFdmVudA


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `String` | Required | PayPal's event id. |
| `event_type` | `String` | Required | - |
| `paypal_order_id` | `String` | Optional | - |
| `summary` | `String` | Optional | - |
| `verified` | `Boolean` | Required | Whether PayPal confirmed the delivery's signature. |
| `outcome` | `String` | Required | - |
| `received_at` | `DateTime` | Required | - |


# Example (as JSON)

```json
{
  "id": "id2",
  "event_type": "PAYMENT.CAPTURE.COMPLETED",
  "summary": "2.99 USD",
  "verified": false,
  "outcome": "Confirmed: order already paid",
  "received_at": "2016-03-13T12:52:32.123Z",
  "paypal_order_id": "paypal_order_id2"
}
```



