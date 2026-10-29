# Api Shops Orders Refund Request

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyME9yZGVycyUyNTIwUmVmdW5kJTI1MjBSZXF1ZXN0

How to refund.


# Class Name

`ApiShopsOrdersRefundRequest`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `record` | `bool` | Optional | `true`: don't contact PayPal, just record that the seller refunded it themselves.<br><br>**Default**: `False` |


# Example

```python
from onethingapi.models.api_shops_orders_refund_request import ApiShopsOrdersRefundRequest

api_shops_orders_refund_request = ApiShopsOrdersRefundRequest(
    record=False
)
```



