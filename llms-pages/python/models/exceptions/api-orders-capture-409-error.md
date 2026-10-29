# Api Orders Capture 409 Error

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwT3JkZXJzJTI1MjBDYXB0dXJlJTI1MjA0MDklMjUyMEVycm9y

Not approved yet.


# Class Name

`ApiOrdersCapture409ErrorException`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `status` | [`Status6`](/llms-pages/python/models/enumerations/status-6.md) | Optional | `pending` until the buyer approves at PayPal. |


# Example

```python
try:
    # make the API call
except ApiOrdersCapture409ErrorException as e:
    print(e)
except ApiException as e:
    print(e)
```



