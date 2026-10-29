# Upload Digital File

Source: /#/http/x-redirect/JTI0ZSUyRlNob3BzJTJGdXBsb2FkRGlnaXRhbEZpbGU

Uploads or replaces a digital product's file, up to 25 MB. Each paid order gets a download link for it.

```http
POST /api/shops/{slug}/file
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/http/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/http/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Template, Required | The shop's link name (current or former). |
| `file` | `File` | Form, Required | Up to 25 MB. |


# Response Type

**200**: Uploaded.

[`Api Shops File Response`](/llms-pages/http/models/structures/api-shops-file-response.md)


# Example Usage

```bash
curl -X POST \
  --url 'https://one-thing-ash0.onrender.com/api/shops/vintageskates/file'  \
  -H 'Accept: application/json' \
  -H 'x-admin-token: x-admin-token' \
  -H 'Authorization: Bearer AccessToken'\
  -F 'file=@dummy_file'
```


# Example Response *(as JSON)*

```json
{
  "ok": true,
  "filename": "raptor-rush-soundtrack.zip"
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`ErrorResponse_ErrorException`](/llms-pages/http/models/exceptions/error-response-error.md) |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`ErrorResponse_ErrorException`](/llms-pages/http/models/exceptions/error-response-error.md) |



