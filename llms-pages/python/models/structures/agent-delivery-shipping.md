# Agent Delivery Shipping

Source: /#/python/x-redirect/JTI0bSUyRkFnZW50RGVsaXZlcnlTaGlwcGluZw

A physical product shipped to the buyer.


# Class Name

`AgentDeliveryShipping`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `mtype` | `str` | Required, Constant | **Value**: `"shipping"` |
| `ship_to` | [`ShipTo`](/llms-pages/python/models/structures/ship-to.md) | Optional | - |
| `fulfillment` | [`Fulfillment`](/llms-pages/python/models/enumerations/fulfillment.md) | Required | - |
| `tracking` | [`Tracking`](/llms-pages/python/models/structures/tracking.md) | Optional | - |


# Example

```python
from onethingapi.models.agent_delivery_shipping import AgentDeliveryShipping
from onethingapi.models.fulfillment import Fulfillment
from onethingapi.models.ship_to import ShipTo
from onethingapi.models.tracking import Tracking

agent_delivery_shipping = AgentDeliveryShipping(
    fulfillment=Fulfillment.TO_SHIP,
    ship_to=ShipTo(
        name='name6',
        address='address2'
    ),
    tracking=Tracking(
        carrier='carrier2',
        number='number8'
    )
)
```



