# Created Shop

Source: /#/python/x-redirect/JTI0bSUyRkNyZWF0ZWRTaG9w

The new draft shop and the credentials to manage it.


# Class Name

`CreatedShop`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Required | The shop's link name: the page is `https://<host>/<slug>`. |
| `token` | `str` | Required | The admin token. Shown once; store it. |
| `manage_url` | `str` | Required | The seller's private manage page (contains the token). |


# Example

```python
from onethingapi.models.created_shop import CreatedShop

created_shop = CreatedShop(
    slug='dragonflight',
    token='3fJ9xQm2LwP8vR1tZk7cN4bY6dHs0aEu',
    manage_url='/manage/vintageskates?token=3fJ9xQm2LwP8vR1tZk7cN4bY6dHs0aEu'
)
```



