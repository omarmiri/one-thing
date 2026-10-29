# Api Shops Orders Refund Response

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyME9yZGVycyUyNTIwUmVmdW5kJTI1MjBSZXNwb25zZQ


# Class Name

`ApiShopsOrdersRefundResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `ok` | `bool` | Required | - |
| `refund_id` | `str` | Optional | PayPal's refund id; null when `record` was used. |


# Example

```python
from onethingapi.models.api_shops_orders_refund_response import ApiShopsOrdersRefundResponse

api_shops_orders_refund_response = ApiShopsOrdersRefundResponse(
    ok=False,
    refund_id='refundId6'
)
```



