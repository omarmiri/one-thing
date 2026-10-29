# Api Shops Color Photos Response

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyMENvbG9yJTI1MjBQaG90b3MlMjUyMFJlc3BvbnNl

The colours that changed.


# Class Name

`ApiShopsColorPhotosResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `saved` | `List[str]` | Required | Colour labels whose photo changed. |


# Example

```python
from onethingapi.models.api_shops_color_photos_response import ApiShopsColorPhotosResponse

api_shops_color_photos_response = ApiShopsColorPhotosResponse(
    saved=[
        'Ice Blue',
        'Amber'
    ]
)
```



