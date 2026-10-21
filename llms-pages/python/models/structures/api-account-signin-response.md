# Api Account Signin Response

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwQWNjb3VudCUyNTIwU2lnbmluJTI1MjBSZXNwb25zZQ


# Class Name

`ApiAccountSigninResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `str` | Required | - |
| `email` | `str` | Required | Lower-cased. |
| `phone` | `str` | Required | Digits, with a leading + if one was given. |


# Example

```python
from onethingapi.models.api_account_signin_response import ApiAccountSigninResponse

api_account_signin_response = ApiAccountSigninResponse(
    id='id0',
    email='email6',
    phone='phone0'
)
```



