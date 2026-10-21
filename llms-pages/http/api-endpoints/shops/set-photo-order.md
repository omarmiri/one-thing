# Set Photo Order

Source: /#/http/x-redirect/JTI0ZSUyRlNob3BzJTJGc2V0UGhvdG9PcmRlcg

Sets the photo order; the first becomes the cover. Leaving a photo out removes it.

```http
PUT /api/shops/{slug}/photos
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/http/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Template, Required | The shop's link name (current or former). |
| `body` | [`Api Shops Photos Request`](/llms-pages/http/models/structures/api-shops-photos-request.md) | Body, Required | - |


# Response Type

**200**: The shop's photos, cover first.

[`Shop Photos`](/llms-pages/http/models/structures/shop-photos.md)


# Example Usage

```bash
curl -X PUT \
  --url 'https://one-thing-ash0.onrender.com/api/shops/raptorrush/photos'  \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'x-admin-token: x-admin-token' \
  --data-raw '{
  "photos": [
    "photos8",
    "photos9"
  ]
}'
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |
| 404 | No such shop, or the admin token doesn't match it. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |



