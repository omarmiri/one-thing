# Api Account Signin Response

Source: /#/http/x-redirect/JTI0bSUyRkFwaSUyNTIwQWNjb3VudCUyNTIwU2lnbmluJTI1MjBSZXNwb25zZQ

The signed-in account.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `String` | Required | The account's id. |
| `email` | `String` | Required | Lower-cased. |
| `phone` | `String` | Required | Digits, with a leading + if one was given. |


# Example (as JSON)

```json
{
  "id": "acc_Vq3nN8cT0bLx2YwE",
  "email": "maker@example.com",
  "phone": "+15555550123"
}
```



