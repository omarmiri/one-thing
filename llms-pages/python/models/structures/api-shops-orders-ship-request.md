# Api Shops Orders Ship Request

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyME9yZGVycyUyNTIwU2hpcCUyNTIwUmVxdWVzdA

The shipment's tracking.


# Class Name

`ApiShopsOrdersShipRequest`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `carrier` | [`Carrier`](/llms-pages/python/models/enumerations/carrier.md) | Required | The carrier. `OTHER` needs `carrierName`. |
| `carrier_name` | `str` | Optional | Required when `carrier` is `OTHER`.<br><br>**Constraints**: *Maximum Length*: `60` |
| `tracking_number` | `str` | Required | The carrier's tracking number.<br><br>**Constraints**: *Minimum Length*: `4`, *Maximum Length*: `64` |


# Example

```python
from onethingapi.models.api_shops_orders_ship_request import ApiShopsOrdersShipRequest
from onethingapi.models.carrier import Carrier

api_shops_orders_ship_request = ApiShopsOrdersShipRequest(
    carrier=Carrier.USPS,
    tracking_number='9400111899223197428490',
    carrier_name='Canada Post'
)
```



