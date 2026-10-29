# Agent Delivery Shipping

Source: /#/http/x-redirect/JTI0bSUyRkFnZW50RGVsaXZlcnlTaGlwcGluZw

A physical product shipped to the buyer.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `type` | `String` | Required, Constant | Always `shipping`.<br><br>**Value**: `shipping` |
| `ship_to` | [`Ship To`](/llms-pages/http/models/structures/ship-to.md) | Optional | Where it ships, from the buyer's PayPal checkout. Null if PayPal didn't share it. |
| `fulfillment` | [`Fulfillment`](/llms-pages/http/models/enumerations/fulfillment.md) | Required | `to_ship` until the seller adds tracking, then `shipped`. |
| `tracking` | [`Tracking`](/llms-pages/http/models/structures/tracking.md) | Optional | The carrier and tracking number once shipped; null before. |


# Example (as JSON)

```json
{
  "type": "shipping",
  "ship_to": {
    "name": "Sam Rivera",
    "address": "1 Main St, Springfield, IL, 62701, US"
  },
  "fulfillment": "to_ship",
  "tracking": {
    "carrier": "USPS",
    "number": "9400111899223197428490"
  }
}
```



