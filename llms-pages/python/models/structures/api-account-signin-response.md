# Api Account Signin Response

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwQWNjb3VudCUyNTIwU2lnbmluJTI1MjBSZXNwb25zZQ

The signed-in account.


# Class Name

`ApiAccountSigninResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `str` | Required | The account's id. |
| `email` | `str` | Required | Lower-cased. |
| `phone` | `str` | Required | Digits, with a leading + if one was given. |


# Example

```python
from onethingapi.models.api_account_signin_response import ApiAccountSigninResponse

api_account_signin_response = ApiAccountSigninResponse(
    id='acc_Vq3nN8cT0bLx2YwE',
    email='maker@example.com',
    phone='+15555550123'
)
```



