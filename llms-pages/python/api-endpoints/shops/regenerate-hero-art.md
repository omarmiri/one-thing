# Regenerate Hero Art

Source: /#/python/x-redirect/JTI0ZSUyRlNob3BzJTJGcmVnZW5lcmF0ZUhlcm9BcnQ

Starts generation in the background. Poll `getShop` for `hero_status`.

```python
def regenerate_hero_art(self,
                       slug)
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/python/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/python/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Template, Required | The shop's link name (current or former). |


# Response Type

**200**: Done.

[`Ok`](/llms-pages/python/models/structures/ok.md)


# Example Usage

```python
slug = 'vintageskates'

result = shops_api.regenerate_hero_art(slug)
print(result)
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
| 400 | Something in the request needs fixing; `error` says what. | [`ErrorResponseException`](/llms-pages/python/models/exceptions/error-response.md) |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`ErrorResponseException`](/llms-pages/python/models/exceptions/error-response.md) |
| 429 | Over this network's cap for the call (see **Limits**). Retry after `Retry-After` seconds. | [`ErrorResponseException`](/llms-pages/python/models/exceptions/error-response.md) |



