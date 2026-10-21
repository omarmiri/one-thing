# Api Orders Capture Response

Source: /#/http/x-redirect/JTI0bSUyRkFwaSUyNTIwT3JkZXJzJTI1MjBDYXB0dXJlJTI1MjBSZXNwb25zZQ


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `orderId` | `String` | Required | OneThing's order id; the thank-you page is `/<slug>/thanks?order=<orderId>`. |
| `status` | `String` | Required, Constant | **Value**: `paid` |


# Example (as JSON)

```json
{
  "orderId": "orderId0",
  "status": "paid"
}
```



