# Api Shops Photos Request

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyMFBob3RvcyUyNTIwUmVxdWVzdA

The new photo order.


# Class Name

`ApiShopsPhotosRequest`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `photos` | `List[str]` | Required | Photo ids, in order.<br><br>**Constraints**: *Maximum Items*: `8` |


# Example

```python
from onethingapi.models.api_shops_photos_request import ApiShopsPhotosRequest

api_shops_photos_request = ApiShopsPhotosRequest(
    photos=[
        'zrySajNyao6_j11x',
        'LFRvGuTU3D8i334X'
    ]
)
```



