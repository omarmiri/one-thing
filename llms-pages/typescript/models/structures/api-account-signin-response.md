# Api Account Signin Response

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwQWNjb3VudCUyNTIwU2lnbmluJTI1MjBSZXNwb25zZQ

The signed-in account.


# Interface Name

`ApiAccountSigninResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `string` | Required | The account's id. |
| `email` | `string \| null` | Required | Lower-cased. |
| `phone` | `string \| null` | Required | Digits, with a leading + if one was given. |


# Example

```ts
import { ApiAccountSigninResponse } from 'one-thing-sdk';

const apiAccountSigninResponse: ApiAccountSigninResponse = {
  id: 'acc_Vq3nN8cT0bLx2YwE',
  email: 'maker@example.com',
  phone: '+15555550123',
};
```



