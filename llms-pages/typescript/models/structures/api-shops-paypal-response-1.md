# Api Shops Paypal Response 1

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyMFBheXBhbCUyNTIwUmVzcG9uc2Ux


# Interface Name

`ApiShopsPaypalResponse1`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `merchantId` | `string \| null` | Required | The seller's PayPal merchant id. |
| `status` | [`ApiShopsPaypalResponse1Status \| null`](/llms-pages/typescript/models/oneof-anyof-definitions/api-shops-paypal-response-1-status.md) | Required | This is a container for one-of cases. |


# Example

```ts
import { ApiShopsPaypalResponse1 } from 'one-thing-sdk';

const apiShopsPaypalResponse1: ApiShopsPaypalResponse1 = {
  merchantId: 'merchantId2',
  status: {
    receivable: false,
    emailConfirmed: false,
    checkedAt: '2016-03-13T12:52:32.123Z',
  },
};
```



