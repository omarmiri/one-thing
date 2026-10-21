# Add Photos

Source: /#/python/x-redirect/JTI0ZSUyRlNob3BzJTJGYWRkUGhvdG9z

Adds one or more photos after the cover. Each is turned upright, resized to at most 2000 px and stored as WebP. A shop holds up to 8 photos; buyers swipe through them on the shop page. Not for recommendations, which show the retailer's photos.

```python
def add_photos(self,
              slug,
              photo)
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/python/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Template, Required | The shop's link name (current or former). |
| `photo` | `typing.BinaryIO` | Form, Required | An image, up to 15 MB. The endpoint also accepts the field repeated, to add several in one request. |


# Response Type

**200**: The shop's photos, cover first.

[`ShopPhotos`](/llms-pages/python/models/structures/shop-photos.md)


# Example Usage

```python
slug = 'raptorrush'

photo = FileWrapper(Path('dummy_file').open('rb'), 'optional-content-type')

result = shops_api.add_photos(
    slug,
    photo
)
print(result)
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 404 | No such shop, or the admin token doesn't match it. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |



