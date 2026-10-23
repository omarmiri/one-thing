# Set Photo Order

Source: /#/python/x-redirect/JTI0ZSUyRlNob3BzJTJGc2V0UGhvdG9PcmRlcg

Sets the photo order; the first becomes the cover. Leaving a photo out removes it.

```python
def set_photo_order(self,
                   slug,
                   body)
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/python/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/python/getting-started/sdk-quickstart/authorization.md)


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
        'zrySajNyao6_j11x',
        'LFRvGuTU3D8i334X',
        'SuqcgNv64HWN8H6e'
    ]
)

result = shops_api.set_photo_order(
    slug,
    body
)
print(result)
```


# Example Response *(as JSON)*

```json
{
  "photos": [
    {
      "id": "LFRvGuTU3D8i334X",
      "url": "/api/blobs/LFRvGuTU3D8i334X"
    },
    {
      "id": "zrySajNyao6_j11x",
      "url": "/api/blobs/zrySajNyao6_j11x"
    }
  ]
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |



