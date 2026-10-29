# Update Shop

Source: /#/http/x-redirect/JTI0ZSUyRlNob3BzJTJGdXBkYXRlU2hvcA

Changes only the fields you send. Renaming `slug` keeps the old link working (it
redirects). Set `status: live` to publish; a digital product needs its file (or, for
access codes, `access_url`) first.

```http
PATCH /api/shops/{slug}
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/http/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/http/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Template, Required | The shop's link name (current or former). |
| `body` | [`Shop Update`](/llms-pages/http/models/structures/shop-update.md) | Body, Required | The fields to change; anything left out stays as it is. |


# Response Type

**200**: Saved.

[`Api Shops Response`](/llms-pages/http/models/structures/api-shops-response.md)


# Example Usage

```bash
curl -X PATCH \
  --url 'https://one-thing-ash0.onrender.com/api/shops/vintageskates'  \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'x-admin-token: x-admin-token' \
  -H 'Authorization: Bearer AccessToken' \
  --data-raw '{
  "status": "live"
}'
```


# Example Response *(as JSON)*

```json
{
  "ok": true,
  "slug": "vintageskates"
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`ErrorResponse_ErrorException`](/llms-pages/http/models/exceptions/error-response-error.md) |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`ErrorResponse_ErrorException`](/llms-pages/http/models/exceptions/error-response-error.md) |



