# Api Shops Orders Refund Response

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyME9yZGVycyUyNTIwUmVmdW5kJTI1MjBSZXNwb25zZQ

The refund.


# Interface Name

`ApiShopsOrdersRefundResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `ok` | `boolean` | Required | Always `true`. |
| `refundId` | `string \| null \| undefined` | Optional | PayPal's refund id; null when `record` was used. |


# Example

```ts
import { ApiShopsOrdersRefundResponse } from 'one-thing-sdk';

const apiShopsOrdersRefundResponse: ApiShopsOrdersRefundResponse = {
  ok: true,
  refundId: '1JU08902781691411',
};
```



