# Match Color Photos

Source: /#/http/x-redirect/JTI0ZSUyRlNob3BzJTJGbWF0Y2hDb2xvclBob3Rvcw

Gemini looks at the shop's photos and says which one shows each colour, so buyers who pick a colour see it. Suggests only; save the matches with `setColorPhotos`. Needs at least two photos.

```http
POST /api/shops/{slug}/match-photos
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/http/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Template, Required | The shop's link name (current or former). |
| `body` | [`Api Shops Match Photos Request`](/llms-pages/http/models/structures/api-shops-match-photos-request.md) | Body, Required | - |


# Response Type

**200**: A photo id for each colour Gemini could match. Colours it couldn't place are left out.

[`Api Shops Match Photos Response`](/llms-pages/http/models/structures/api-shops-match-photos-response.md)


# Example Usage

```bash
curl -X POST \
  --url 'https://one-thing-ash0.onrender.com/api/shops/raptorrush/match-photos'  \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'x-admin-token: x-admin-token' \
  --data-raw '{
  "colors": [
    {
      "label": "Forest green",
      "hex": "#14171a"
    }
  ]
}'
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |
| 404 | No such shop, or the admin token doesn't match it. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |



