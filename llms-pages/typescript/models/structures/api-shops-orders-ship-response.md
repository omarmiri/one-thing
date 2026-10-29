# Api Shops Orders Ship Response

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyME9yZGVycyUyNTIwU2hpcCUyNTIwUmVzcG9uc2U

The order is marked shipped.


# Interface Name

`ApiShopsOrdersShipResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `ok` | `boolean` | Required | Always `true`. |
| `synced` | `boolean` | Required | Whether PayPal accepted the tracking number. |


# Example

```ts
import { ApiShopsOrdersShipResponse } from 'one-thing-sdk';

const apiShopsOrdersShipResponse: ApiShopsOrdersShipResponse = {
  ok: true,
  synced: true,
};
```



