# Api Shops Orders Ship Request

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyME9yZGVycyUyNTIwU2hpcCUyNTIwUmVxdWVzdA


# Interface Name

`ApiShopsOrdersShipRequest`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `carrier` | [`Carrier`](/llms-pages/typescript/models/enumerations/carrier.md) | Required | - |
| `carrierName` | `string \| undefined` | Optional | Required when `carrier` is `OTHER`.<br><br>**Constraints**: *Maximum Length*: `60` |
| `trackingNumber` | `string` | Required | **Constraints**: *Minimum Length*: `4`, *Maximum Length*: `64` |


# Example

```ts
import { ApiShopsOrdersShipRequest, Carrier } from 'one-thing-sdk';

const apiShopsOrdersShipRequest: ApiShopsOrdersShipRequest = {
  carrier: Carrier.Dhl,
  trackingNumber: 'trackingNumber4',
  carrierName: 'carrierName4',
};
```



