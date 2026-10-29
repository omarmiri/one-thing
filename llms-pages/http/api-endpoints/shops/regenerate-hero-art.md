# Regenerate Hero Art

Source: /#/http/x-redirect/JTI0ZSUyRlNob3BzJTJGcmVnZW5lcmF0ZUhlcm9BcnQ

Starts generation in the background. Poll `getShop` for `hero_status`.

```http
POST /api/shops/{slug}/hero
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/http/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/http/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Template, Required | The shop's link name (current or former). |


# Response Type

**200**: Done.

[`Ok`](/llms-pages/http/models/structures/ok.md)


# Example Usage

```bash
curl -X POST \
  --url 'https://one-thing-ash0.onrender.com/api/shops/vintageskates/hero'  \
  -H 'Accept: application/json' \
  -H 'x-admin-token: x-admin-token' \
  -H 'Authorization: Bearer AccessToken'
```


# Example Response *(as JSON)*

```json
{
  "ok": true
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`ErrorResponse_ErrorException`](/llms-pages/http/models/exceptions/error-response-error.md) |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`ErrorResponse_ErrorException`](/llms-pages/http/models/exceptions/error-response-error.md) |
| 429 | Over this network's cap for the call (see **Limits**). Retry after `Retry-After` seconds. | [`ErrorResponse_ErrorException`](/llms-pages/http/models/exceptions/error-response-error.md) |



