# Api Access Verify Request

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwQWNjZXNzJTI1MjBWZXJpZnklMjUyMFJlcXVlc3Q


# Class Name

`ApiAccessVerifyRequest`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `shop` | `str` | Required | The shop's link name. |
| `code` | `str` | Required | - |


# Example

```python
from onethingapi.models.api_access_verify_request import ApiAccessVerifyRequest

api_access_verify_request = ApiAccessVerifyRequest(
    shop='raptorrush',
    code='K7QF-M2XP-9HTD'
)
```



