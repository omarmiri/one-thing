# Api Access Verify Response

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwQWNjZXNzJTI1MjBWZXJpZnklMjUyMFJlc3BvbnNl


# Class Name

`ApiAccessVerifyResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `valid` | `bool` | Required | - |
| `product` | `str` | Optional | The product name, when valid. |


# Example

```python
from onethingapi.models.api_access_verify_response import ApiAccessVerifyResponse

api_access_verify_response = ApiAccessVerifyResponse(
    valid=False,
    product='product6'
)
```



