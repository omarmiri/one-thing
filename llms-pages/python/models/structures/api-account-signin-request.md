# Api Account Signin Request

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwQWNjb3VudCUyNTIwU2lnbmluJTI1MjBSZXF1ZXN0


# Class Name

`ApiAccountSigninRequest`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `identifier` | `str` | Required | An email address, or a phone number (spaces, dashes and brackets are ignored; keep a leading +). |


# Example

```python
from onethingapi.models.api_account_signin_request import ApiAccountSigninRequest

api_account_signin_request = ApiAccountSigninRequest(
    identifier='maker@example.com'
)
```



