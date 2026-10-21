# Upload Digital File

Source: /#/http/x-redirect/JTI0ZSUyRlNob3BzJTJGdXBsb2FkRGlnaXRhbEZpbGU

Uploads or replaces a digital product's file, up to 25 MB. Each paid order gets a download link for it.

```http
POST /api/shops/{slug}/file
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/http/getting-started/sdk-quickstart/authorization.md)


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
  --url 'https://one-thing-ash0.onrender.com/api/shops/raptorrush/file'  \
  -H 'Accept: application/json' \
  -H 'x-admin-token: x-admin-token'\
  -F 'file=@dummy_file'
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |
| 404 | No such shop, or the admin token doesn't match it. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |



