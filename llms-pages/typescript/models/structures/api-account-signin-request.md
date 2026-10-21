# Api Account Signin Request

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwQWNjb3VudCUyNTIwU2lnbmluJTI1MjBSZXF1ZXN0


# Interface Name

`ApiAccountSigninRequest`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `identifier` | `string` | Required | An email address, or a phone number (spaces, dashes and brackets are ignored; keep a leading +). |


# Example

```ts
import { ApiAccountSigninRequest } from 'one-thing-sdk';

const apiAccountSigninRequest: ApiAccountSigninRequest = {
  identifier: 'maker@example.com',
};
```



