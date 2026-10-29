# Api Shops Color Photos Request

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyMENvbG9yJTI1MjBQaG90b3MlMjUyMFJlcXVlc3Q

Which photo shows each colour.


# Class Name

`ApiShopsColorPhotosRequest`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `photos` | `Dict[str, str]` | Required | Colour label → photo id, or `null`. |


# Example

```python
from onethingapi.models.api_shops_color_photos_request import ApiShopsColorPhotosRequest

api_shops_color_photos_request = ApiShopsColorPhotosRequest(
    photos={
        'Ice Blue': 'zrySajNyao6_j11x',
        'Amber': None
    }
)
```



