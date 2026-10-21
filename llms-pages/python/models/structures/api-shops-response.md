# Api Shops Response

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyMFJlc3BvbnNl


# Class Name

`ApiShopsResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `ok` | `bool` | Required | - |
| `slug` | `str` | Required | The shop's link name after this change. |


# Example

```python
from onethingapi.models.api_shops_response import ApiShopsResponse

api_shops_response = ApiShopsResponse(
    ok=False,
    slug='slug6'
)
```



