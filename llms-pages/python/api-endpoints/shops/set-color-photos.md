# Set Color Photos

Source: /#/python/x-redirect/JTI0ZSUyRlNob3BzJTJGc2V0Q29sb3JQaG90b3M

Saves which photo shows each colour, and nothing else about the shop. Only colours already saved in the shop's options change; `null` clears a colour's photo. A photo id that isn't one of the shop's photos is ignored.

```python
def set_color_photos(self,
                    slug,
                    body)
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/python/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/python/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Template, Required | The shop's link name (current or former). |
| `body` | [`ApiShopsColorPhotosRequest`](/llms-pages/python/models/structures/api-shops-color-photos-request.md) | Body, Required | The photo for each colour. |


# Response Type

**200**: The colours that were changed.

[`ApiShopsColorPhotosResponse`](/llms-pages/python/models/structures/api-shops-color-photos-response.md)


# Example Usage

```python
slug = 'vintageskates'

body = ApiShopsColorPhotosRequest(
    photos={
        'Cream': 'LFRvGuTU3D8i334X',
        'Red': None
    }
)

result = shops_api.set_color_photos(
    slug,
    body
)
print(result)
```


# Example Response *(as JSON)*

```json
{
  "saved": [
    "Cream",
    "Red"
  ]
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`ErrorResponseException`](/llms-pages/python/models/exceptions/error-response.md) |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`ErrorResponseException`](/llms-pages/python/models/exceptions/error-response.md) |



