# Api Orders Capture Response

Source: /#/http/x-redirect/JTI0bSUyRkFwaSUyNTIwT3JkZXJzJTI1MjBDYXB0dXJlJTI1MjBSZXNwb25zZQ

The paid order.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `orderId` | `String` | Required | OneThing's order id; the thank-you page is `/<slug>/thanks?order=<orderId>`. |
| `status` | `String` | Required, Constant | Always `paid`.<br><br>**Value**: `paid` |


# Example (as JSON)

```json
{
  "orderId": "pX4kR9tVb2nQ7sLe",
  "status": "paid"
}
```



