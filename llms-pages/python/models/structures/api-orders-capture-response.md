# Api Orders Capture Response

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwT3JkZXJzJTI1MjBDYXB0dXJlJTI1MjBSZXNwb25zZQ


# Class Name

`ApiOrdersCaptureResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `order_id` | `str` | Required | OneThing's order id; the thank-you page is `/<slug>/thanks?order=<orderId>`. |
| `status` | `str` | Required, Constant | **Value**: `"paid"` |


# Example

```python
from onethingapi.models.api_orders_capture_response import ApiOrdersCaptureResponse

api_orders_capture_response = ApiOrdersCaptureResponse(
    order_id='orderId8'
)
```



