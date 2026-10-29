# Pay Pal Status

Source: /#/typescript/x-redirect/JTI0bSUyRlBheVBhbFN0YXR1cw

What PayPal last said about a connected seller account.


# Interface Name

`PayPalStatus`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `receivable` | `boolean` | Required | The account can receive payments. |
| `emailConfirmed` | `boolean` | Required | The seller has confirmed their email with PayPal. |
| `checkedAt` | `string` | Required | When OneThing last asked PayPal. |


# Example

```ts
import { PayPalStatus } from 'one-thing-sdk';

const payPalStatus: PayPalStatus = {
  receivable: true,
  emailConfirmed: true,
  checkedAt: '2026-10-22T02:41:37Z',
};
```



