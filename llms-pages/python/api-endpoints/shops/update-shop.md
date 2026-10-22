# Update Shop

Source: /#/python/x-redirect/JTI0ZSUyRlNob3BzJTJGdXBkYXRlU2hvcA

Changes only the fields you send. Renaming `slug` keeps the old link working (it
redirects). Set `status: live` to publish; a digital product needs its file (or, for
access codes, `access_url`) first.

```python
def update_shop(self,
               slug,
               body)
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/python/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Template, Required | The shop's link name (current or former). |
| `body` | [`ShopUpdate`](/llms-pages/python/models/structures/shop-update.md) | Body, Required | - |


# Response Type

**200**: Saved.

[`ApiShopsResponse`](/llms-pages/python/models/structures/api-shops-response.md)


# Example Usage

```python
slug = 'raptorrush'

body = ShopUpdate(
    option_stock={
        'M / Black': 4,
        'L / Black': 0
    }
)

result = shops_api.update_shop(
    slug,
    body
)
print(result)
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 404 | No such shop, or the admin token doesn't match it. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |



