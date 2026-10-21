# Api Account Signin Response

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwQWNjb3VudCUyNTIwU2lnbmluJTI1MjBSZXNwb25zZQ


# Interface Name

`ApiAccountSigninResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `string` | Required | - |
| `email` | `string \| null` | Required | Lower-cased. |
| `phone` | `string \| null` | Required | Digits, with a leading + if one was given. |


# Example

```ts
import { ApiAccountSigninResponse } from 'one-thing-sdk';

const apiAccountSigninResponse: ApiAccountSigninResponse = {
  id: 'id4',
  email: 'email2',
  phone: 'phone6',
};
```



