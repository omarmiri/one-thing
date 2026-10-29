# Api Shops File Response

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyMEZpbGUlMjUyMFJlc3BvbnNl

The uploaded file.


# Class Name

`ApiShopsFileResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `ok` | `bool` | Required | Always `true`. |
| `filename` | `str` | Required | The file's name, as buyers will download it. |


# Example

```python
from onethingapi.models.api_shops_file_response import ApiShopsFileResponse

api_shops_file_response = ApiShopsFileResponse(
    ok=True,
    filename='dragon-flight-presets.zip'
)
```



