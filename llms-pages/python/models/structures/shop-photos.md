# Shop Photos

Source: /#/python/x-redirect/JTI0bSUyRlNob3BQaG90b3M


# Class Name

`ShopPhotos`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `photos` | [`List[Photo]`](/llms-pages/python/models/structures/photo.md) | Required | - |


# Example

```python
from onethingapi.models.photo import Photo
from onethingapi.models.shop_photos import ShopPhotos

shop_photos = ShopPhotos(
    photos=[
        Photo(
            id='id8',
            url='url2'
        )
    ]
)
```



