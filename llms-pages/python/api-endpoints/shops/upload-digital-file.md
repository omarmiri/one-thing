# Upload Digital File

Source: /#/python/x-redirect/JTI0ZSUyRlNob3BzJTJGdXBsb2FkRGlnaXRhbEZpbGU

Uploads or replaces a digital product's file, up to 25 MB. Each paid order gets a download link for it.

```python
def upload_digital_file(self,
                       slug,
                       file)
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/python/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Template, Required | The shop's link name (current or former). |
| `file` | `typing.BinaryIO` | Form, Required | Up to 25 MB. |


# Response Type

**200**: Uploaded.

[`ApiShopsFileResponse`](/llms-pages/python/models/structures/api-shops-file-response.md)


# Example Usage

```python
slug = 'raptorrush'

file = FileWrapper(Path('dummy_file').open('rb'), 'optional-content-type')

result = shops_api.upload_digital_file(
    slug,
    file
)
print(result)
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 404 | No such shop, or the admin token doesn't match it. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |



