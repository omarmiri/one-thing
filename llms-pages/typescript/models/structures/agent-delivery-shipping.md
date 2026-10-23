# Agent Delivery Shipping

Source: /#/typescript/x-redirect/JTI0bSUyRkFnZW50RGVsaXZlcnlTaGlwcGluZw

A physical product shipped to the buyer.


# Interface Name

`AgentDeliveryShipping`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `type` | `string` | Required, Constant | **Value**: `'shipping'` |
| `shipTo` | [`ShipTo \| null \| undefined`](/llms-pages/typescript/models/structures/ship-to.md) | Optional | - |
| `fulfillment` | [`Fulfillment`](/llms-pages/typescript/models/enumerations/fulfillment.md) | Required | - |
| `tracking` | [`Tracking \| null \| undefined`](/llms-pages/typescript/models/structures/tracking.md) | Optional | - |


# Example

```ts
import { AgentDeliveryShipping, Fulfillment } from 'one-thing-sdk';

const agentDeliveryShipping: AgentDeliveryShipping = {
  type: 'shipping',
  fulfillment: Fulfillment.ToShip,
  shipTo: {
    name: 'name6',
    address: 'address2',
  },
  tracking: {
    carrier: 'carrier2',
    number: 'number8',
  },
};
```



