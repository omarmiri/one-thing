# Set Color Photos

Source: /#/http/x-redirect/JTI0ZSUyRlNob3BzJTJGc2V0Q29sb3JQaG90b3M

Saves which photo shows each colour, and nothing else about the shop. Only colours already saved in the shop's options change; `null` clears a colour's photo. A photo id that isn't one of the shop's photos is ignored.

```http
PUT /api/shops/{slug}/color-photos
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/http/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/http/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Template, Required | The shop's link name (current or former). |
| `body` | [`Api Shops Color Photos Request`](/llms-pages/http/models/structures/api-shops-color-photos-request.md) | Body, Required | - |


# Response Type

**200**: The colours that were changed.

[`Api Shops Color Photos Response`](/llms-pages/http/models/structures/api-shops-color-photos-response.md)


# Example Usage

```bash
curl -X PUT \
  --url 'https://one-thing-ash0.onrender.com/api/shops/raptorrush/color-photos'  \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'x-admin-token: x-admin-token' \
  -H 'Authorization: Bearer AccessToken' \
  --data-raw '{
  "photos": {
    "key0": "photos8",
    "key1": "photos9"
  }
}'
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |



