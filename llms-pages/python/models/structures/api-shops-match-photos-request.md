# Api Shops Match Photos Request

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyME1hdGNoJTI1MjBQaG90b3MlMjUyMFJlcXVlc3Q

The colours to find photos for.


# Class Name

`ApiShopsMatchPhotosRequest`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `colors` | [`List[Color]`](/llms-pages/python/models/structures/color.md) | Required | The colour option's values.<br><br>**Constraints**: *Minimum Items*: `1`, *Maximum Items*: `12` |


# Example

```python
from onethingapi.models.api_shops_match_photos_request import ApiShopsMatchPhotosRequest
from onethingapi.models.color import Color

api_shops_match_photos_request = ApiShopsMatchPhotosRequest(
    colors=[
        Color(
            label='Ice Blue',
            hex='#9fd3e6'
        )
    ]
)
```



