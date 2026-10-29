# Api Orders Request

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwT3JkZXJzJTI1MjBSZXF1ZXN0

The shop to buy from and the buyer's pick.


# Class Name

`ApiOrdersRequest`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Required | The shop's link name. |
| `options` | `Dict[str, str]` | Optional | The buyer's pick, one value per option, keyed by option name. |


# Example

```python
from onethingapi.models.api_orders_request import ApiOrdersRequest

api_orders_request = ApiOrdersRequest(
    slug='vintageskates',
    options={
        'Size': 'M',
        'Color': 'Black'
    }
)
```



