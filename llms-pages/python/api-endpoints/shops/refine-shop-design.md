# Refine Shop Design

Source: /#/python/x-redirect/JTI0ZSUyRlNob3BzJTJGcmVmaW5lU2hvcERlc2lnbg

"Make it warmer", "shorter copy", "more premium". Gemini edits the design spec.

```python
def refine_shop_design(self,
                      slug,
                      body)
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/python/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/python/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Template, Required | The shop's link name (current or former). |
| `body` | [`ApiShopsRefineRequest`](/llms-pages/python/models/structures/api-shops-refine-request.md) | Body, Required | - |


# Response Type

**200**: The new design.

[`ApiShopsRefineResponse`](/llms-pages/python/models/structures/api-shops-refine-response.md)


# Example Usage

```python
slug = 'raptorrush'

body = ApiShopsRefineRequest(
    instruction='Make it feel more premium'
)

result = shops_api.refine_shop_design(
    slug,
    body
)
print(result)
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |



