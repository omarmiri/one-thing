# Api Shops Match Photos Response

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyME1hdGNoJTI1MjBQaG90b3MlMjUyMFJlc3BvbnNl

Gemini's matches.


# Class Name

`ApiShopsMatchPhotosResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `matches` | `Dict[str, str]` | Required | Colour label → photo id. |


# Example

```python
from onethingapi.models.api_shops_match_photos_response import ApiShopsMatchPhotosResponse

api_shops_match_photos_response = ApiShopsMatchPhotosResponse(
    matches={
        'Black': 'b_8f2k1',
        'Forest green': 'b_q93md'
    }
)
```



