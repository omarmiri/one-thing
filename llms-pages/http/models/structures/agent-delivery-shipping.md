# Agent Delivery Shipping

Source: /#/http/x-redirect/JTI0bSUyRkFnZW50RGVsaXZlcnlTaGlwcGluZw

A physical product shipped to the buyer.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `type` | `String` | Required, Constant | **Value**: `shipping` |
| `ship_to` | [`Ship To`](/llms-pages/http/models/structures/ship-to.md) | Optional | - |
| `fulfillment` | [`Fulfillment`](/llms-pages/http/models/enumerations/fulfillment.md) | Required | - |
| `tracking` | [`Tracking`](/llms-pages/http/models/structures/tracking.md) | Optional | - |


# Example (as JSON)

```json
{
  "type": "shipping",
  "fulfillment": "to_ship",
  "ship_to": {
    "name": "name6",
    "address": "address2"
  },
  "tracking": {
    "carrier": "carrier2",
    "number": "number8"
  }
}
```



