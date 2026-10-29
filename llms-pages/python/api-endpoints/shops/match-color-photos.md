# Match Color Photos

Source: /#/python/x-redirect/JTI0ZSUyRlNob3BzJTJGbWF0Y2hDb2xvclBob3Rvcw

Gemini looks at the shop's photos and says which one shows each colour, so buyers who pick a colour see it. Suggests only; save the matches with `setColorPhotos`. Needs at least two photos.

```python
def match_color_photos(self,
                      slug,
                      body)
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/python/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/python/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Template, Required | The shop's link name (current or former). |
| `body` | [`ApiShopsMatchPhotosRequest`](/llms-pages/python/models/structures/api-shops-match-photos-request.md) | Body, Required | The colour option's values. |


# Response Type

**200**: A photo id for each colour Gemini could match. Colours it couldn't place are left out.

[`ApiShopsMatchPhotosResponse`](/llms-pages/python/models/structures/api-shops-match-photos-response.md)


# Example Usage

```python
slug = 'vintageskates'

body = ApiShopsMatchPhotosRequest(
    colors=[
        Color(
            label='Cream',
            hex='#f3e9d2'
        ),
        Color(
            label='Red',
            hex='#b3261e'
        )
    ]
)

result = shops_api.match_color_photos(
    slug,
    body
)
print(result)
```


# Example Response *(as JSON)*

```json
{
  "matches": {
    "Cream": "LFRvGuTU3D8i334X",
    "Red": "SuqcgNv64HWN8H6e"
  }
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`ErrorResponseException`](/llms-pages/python/models/exceptions/error-response.md) |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`ErrorResponseException`](/llms-pages/python/models/exceptions/error-response.md) |
| 429 | Over this network's cap for the call (see **Limits**). Retry after `Retry-After` seconds. | [`ErrorResponseException`](/llms-pages/python/models/exceptions/error-response.md) |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`ErrorResponseException`](/llms-pages/python/models/exceptions/error-response.md) |



