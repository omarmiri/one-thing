# Api Paypal Client Token Response

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwUGF5cGFsJTI1MjBDbGllbnQlMjUyMFRva2VuJTI1MjBSZXNwb25zZQ

The client token.


# Interface Name

`ApiPaypalClientTokenResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `clientToken` | `string` | Required | Pass to `createInstance` in the PayPal JavaScript SDK v6. |


# Example

```ts
import { ApiPaypalClientTokenResponse } from 'one-thing-sdk';

const apiPaypalClientTokenResponse: ApiPaypalClientTokenResponse = {
  clientToken: 'eyJraWQiOiJFWEFNUExFIn0.example.client-token',
};
```



