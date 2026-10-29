# Api Shops Orders Refund Response

Source: /#/http/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyME9yZGVycyUyNTIwUmVmdW5kJTI1MjBSZXNwb25zZQ

The refund.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `ok` | `Boolean` | Required | Always `true`. |
| `refundId` | `String` | Optional | PayPal's refund id; null when `record` was used. |


# Example (as JSON)

```json
{
  "ok": true,
  "refundId": "1JU08902781691411"
}
```



