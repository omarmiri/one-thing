# Api Shops Orders Refund 409 Error

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyME9yZGVycyUyNTIwUmVmdW5kJTI1MjA0MDklMjUyMEVycm9y

Why the order can't be refunded here.


# Class Name

`ApiShopsOrdersRefund409ErrorException`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `error` | `str` | Required | A sentence you can show to a person. |
| `field` | `str` | Optional | The form field at fault, when there is one. |
| `detail` | `str` | Optional | The upstream service's own message, for debugging. |
| `refund_in_pay_pal` | `bool` | Optional | Refund it in PayPal yourself, then call again with `record: true`. |


# Example

```python
try:
    # make the API call
except ApiShopsOrdersRefund409ErrorException as e:
    print(e)
except ApiException as e:
    print(e)
```



