# Agent Delivery Shipping

Source: /#/python/x-redirect/JTI0bSUyRkFnZW50RGVsaXZlcnlTaGlwcGluZw

A physical product shipped to the buyer.


# Class Name

`AgentDeliveryShipping`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `mtype` | `str` | Required, Constant | Always `shipping`.<br><br>**Value**: `"shipping"` |
| `ship_to` | [`ShipTo`](/llms-pages/python/models/structures/ship-to.md) | Optional | Where it ships, from the buyer's PayPal checkout. Null if PayPal didn't share it. |
| `fulfillment` | [`Fulfillment`](/llms-pages/python/models/enumerations/fulfillment.md) | Required | `to_ship` until the seller adds tracking, then `shipped`. |
| `tracking` | [`Tracking`](/llms-pages/python/models/structures/tracking.md) | Optional | The carrier and tracking number once shipped; null before. |


# Example

```python
from onethingapi.models.agent_delivery_shipping import AgentDeliveryShipping
from onethingapi.models.fulfillment import Fulfillment
from onethingapi.models.ship_to import ShipTo
from onethingapi.models.tracking import Tracking

agent_delivery_shipping = AgentDeliveryShipping(
    fulfillment=Fulfillment.TO_SHIP,
    ship_to=ShipTo(
        name='Sam Rivera',
        address='1 Main St, Springfield, IL, 62701, US'
    ),
    tracking=Tracking(
        carrier='USPS',
        number='9400111899223197428490'
    )
)
```



