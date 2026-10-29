# Photo

Source: /#/python/x-redirect/JTI0bSUyRlBob3Rv

One photo.


# Class Name

`Photo`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `str` | Required | The photo's id, for `getImage`, `setPhotoOrder` and colour matching. |
| `url` | `str` | Required | Public image URL on this site. |


# Example

```python
from onethingapi.models.photo import Photo

photo = Photo(
    id='LFRvGuTU3D8i334X',
    url='/api/blobs/LFRvGuTU3D8i334X'
)
```



