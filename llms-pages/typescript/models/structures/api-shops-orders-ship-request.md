# Api Shops Orders Ship Request

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyME9yZGVycyUyNTIwU2hpcCUyNTIwUmVxdWVzdA

The shipment's tracking.


# Interface Name

`ApiShopsOrdersShipRequest`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `carrier` | [`Carrier`](/llms-pages/typescript/models/enumerations/carrier.md) | Required | The carrier. `OTHER` needs `carrierName`. |
| `carrierName` | `string \| undefined` | Optional | Required when `carrier` is `OTHER`.<br><br>**Constraints**: *Maximum Length*: `60` |
| `trackingNumber` | `string` | Required | The carrier's tracking number.<br><br>**Constraints**: *Minimum Length*: `4`, *Maximum Length*: `64` |


# Example

```ts
import { ApiShopsOrdersShipRequest, Carrier } from 'one-thing-sdk';

const apiShopsOrdersShipRequest: ApiShopsOrdersShipRequest = {
  carrier: Carrier.Usps,
  trackingNumber: '9400111899223197428490',
  carrierName: 'Canada Post',
};
```



