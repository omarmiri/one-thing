# Api Orders Capture Response

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwT3JkZXJzJTI1MjBDYXB0dXJlJTI1MjBSZXNwb25zZQ


# Interface Name

`ApiOrdersCaptureResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `orderId` | `string` | Required | OneThing's order id; the thank-you page is `/<slug>/thanks?order=<orderId>`. |
| `status` | `string` | Required, Constant | **Value**: `'paid'` |


# Example

```ts
import { ApiOrdersCaptureResponse } from 'one-thing-sdk';

const apiOrdersCaptureResponse: ApiOrdersCaptureResponse = {
  orderId: 'orderId8',
  status: 'paid',
};
```



