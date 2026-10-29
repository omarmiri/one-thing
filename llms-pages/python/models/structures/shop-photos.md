# Shop Photos

Source: /#/python/x-redirect/JTI0bSUyRlNob3BQaG90b3M

The shop's photos.


# Class Name

`ShopPhotos`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `photos` | [`List[Photo]`](/llms-pages/python/models/structures/photo.md) | Required | Every photo, the cover first. |


# Example

```python
from onethingapi.models.photo import Photo
from onethingapi.models.shop_photos import ShopPhotos

shop_photos = ShopPhotos(
    photos=[
        Photo(
            id='LFRvGuTU3D8i334X',
            url='/api/blobs/LFRvGuTU3D8i334X'
        )
    ]
)
```



