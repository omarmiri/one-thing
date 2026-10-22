# Api Shops Match Photos Request

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyME1hdGNoJTI1MjBQaG90b3MlMjUyMFJlcXVlc3Q


# Class Name

`ApiShopsMatchPhotosRequest`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `colors` | [`List[Color]`](/llms-pages/python/models/structures/color.md) | Required | **Constraints**: *Minimum Items*: `1`, *Maximum Items*: `12` |


# Example

```python
from onethingapi.models.api_shops_match_photos_request import ApiShopsMatchPhotosRequest
from onethingapi.models.color import Color

api_shops_match_photos_request = ApiShopsMatchPhotosRequest(
    colors=[
        Color(
            label='Forest green',
            hex='#14171a'
        )
    ]
)
```



