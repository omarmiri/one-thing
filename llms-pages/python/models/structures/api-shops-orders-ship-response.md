# Api Shops Orders Ship Response

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyME9yZGVycyUyNTIwU2hpcCUyNTIwUmVzcG9uc2U


# Class Name

`ApiShopsOrdersShipResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `ok` | `bool` | Required | - |
| `synced` | `bool` | Required | Whether PayPal accepted the tracking number. |


# Example

```python
from onethingapi.models.api_shops_orders_ship_response import ApiShopsOrdersShipResponse

api_shops_orders_ship_response = ApiShopsOrdersShipResponse(
    ok=False,
    synced=False
)
```



