# Api Access Verify Response

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwQWNjZXNzJTI1MjBWZXJpZnklMjUyMFJlc3BvbnNl


# Interface Name

`ApiAccessVerifyResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `valid` | `boolean` | Required | - |
| `product` | `string \| undefined` | Optional | The product name, when valid. |


# Example

```ts
import { ApiAccessVerifyResponse } from 'one-thing-sdk';

const apiAccessVerifyResponse: ApiAccessVerifyResponse = {
  valid: false,
  product: 'product4',
};
```



