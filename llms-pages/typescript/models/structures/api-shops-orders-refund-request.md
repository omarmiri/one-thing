# Api Shops Orders Refund Request

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyME9yZGVycyUyNTIwUmVmdW5kJTI1MjBSZXF1ZXN0

How to refund.


# Interface Name

`ApiShopsOrdersRefundRequest`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `record` | `boolean \| undefined` | Optional | `true`: don't contact PayPal, just record that the seller refunded it themselves.<br><br>**Default**: `false` |


# Example

```ts
import { ApiShopsOrdersRefundRequest } from 'one-thing-sdk';

const apiShopsOrdersRefundRequest: ApiShopsOrdersRefundRequest = {
  record: false,
};
```



