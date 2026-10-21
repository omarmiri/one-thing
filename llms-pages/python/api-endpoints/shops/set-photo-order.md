# Set Photo Order

Source: /#/python/x-redirect/JTI0ZSUyRlNob3BzJTJGc2V0UGhvdG9PcmRlcg

Sets the photo order; the first becomes the cover. Leaving a photo out removes it.

```python
def set_photo_order(self,
                   slug,
                   body)
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/python/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Template, Required | The shop's link name (current or former). |
| `body` | [`ApiShopsPhotosRequest`](/llms-pages/python/models/structures/api-shops-photos-request.md) | Body, Required | - |


# Response Type

**200**: The shop's photos, cover first.

[`ShopPhotos`](/llms-pages/python/models/structures/shop-photos.md)


# Example Usage

```python
slug = 'raptorrush'

body = ApiShopsPhotosRequest(
    photos=[
        'photos8',
        'photos9'
    ]
)

result = shops_api.set_photo_order(
    slug,
    body
)
print(result)
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 404 | No such shop, or the admin token doesn't match it. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |



