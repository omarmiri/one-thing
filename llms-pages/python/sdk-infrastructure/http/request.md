# Request

Source: /#/python/x-redirect/JTI0aCUyRl9fYWRkaXRpb25hbF9kb2N1bWVudGF0aW9uJTJGSFRUUCUyRlJlcXVlc3Q

Framework-agnostic HTTP request snapshot.

# Attributes

| Name | Type | Tag | Description |
|  --- | --- | --- | --- |
| method | `str` |  | HTTP method of the request (e.g., "GET", "POST", "PUT"). |
| path | `str` |  | Path component of the request URL (e.g., "/users/123"). |
| url | `str` | optional | Full request URL, if available. |
| headers | `dict[str, str]` |  | HTTP headers; keys are lowercase names and values are header strings. |
| raw_body | `bytes` |  | Raw request body as a byte sequence (useful for cryptographic verification). |
| query | `dict[str, list[str]]` | optional | Query string parameters mapped to lists of values (e.g., {"filter": ["active"]}). |
| cookies | `dict[str, str]` | optional | Cookies sent with the request; keys are cookie names, values are strings. |
| form | `dict[str, list[str]]` | optional | Form fields (typically for application/x-www-form-urlencoded) mapped to lists of values. |

# Converter Methods

| Name | Return Type | Description |
|  --- | --- | --- |
| to_core_request | `Request` | Convert a Flask or Django request into a framework-agnostic `Request`. |
| to_core_request_async | `Request` | Convert asynchronously a Starlette, Flask, or Django request into a framework-agnostic `Request`. |



