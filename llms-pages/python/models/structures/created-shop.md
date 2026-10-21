# Created Shop

Source: /#/python/x-redirect/JTI0bSUyRkNyZWF0ZWRTaG9w


# Class Name

`CreatedShop`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Required | - |
| `token` | `str` | Required | The admin token. Shown once; store it. |
| `manage_url` | `str` | Required | The seller's private manage page (contains the token). |


# Example

```python
from onethingapi.models.created_shop import CreatedShop

created_shop = CreatedShop(
    slug='dragonflight',
    token='token4',
    manage_url='manageUrl4'
)
```



