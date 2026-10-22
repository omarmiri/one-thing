# Add Photos

Source: /#/http/x-redirect/JTI0ZSUyRlNob3BzJTJGYWRkUGhvdG9z

Adds one or more photos after the cover. Each is turned upright, resized to at most 2000 px and stored as WebP. A shop holds up to 8 photos; buyers swipe through them on the shop page. Not for recommendations, which show the retailer's photos.

```http
POST /api/shops/{slug}/photos
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/http/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/http/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Template, Required | The shop's link name (current or former). |
| `photo` | `File` | Form, Required | An image, up to 15 MB. The endpoint also accepts the field repeated, to add several in one request. |


# Response Type

**200**: The shop's photos, cover first.

[`Shop Photos`](/llms-pages/http/models/structures/shop-photos.md)


# Example Usage

```bash
curl -X POST \
  --url 'https://one-thing-ash0.onrender.com/api/shops/raptorrush/photos'  \
  -H 'Accept: application/json' \
  -H 'x-admin-token: x-admin-token' \
  -H 'Authorization: Bearer AccessToken'\
  -F 'photo=@dummy_file'
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |



