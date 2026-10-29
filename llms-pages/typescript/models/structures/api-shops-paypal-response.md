# Api Shops Paypal Response

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyMFBheXBhbCUyNTIwUmVzcG9uc2U

The onboarding link.


# Interface Name

`ApiShopsPaypalResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `url` | `string` | Required | PayPal's onboarding page for this shop. |


# Example

```ts
import { ApiShopsPaypalResponse } from 'one-thing-sdk';

const apiShopsPaypalResponse: ApiShopsPaypalResponse = {
  url: 'https://www.sandbox.paypal.com/bizsignup/partner/entry?referralToken=EXAMPLE',
};
```



