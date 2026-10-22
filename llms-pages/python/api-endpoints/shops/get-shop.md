# Get Shop

Source: /#/python/x-redirect/JTI0ZSUyRlNob3BzJTJGZ2V0U2hvcA

Everything about the shop, including the AI's design spec and guesses.

```python
def get_shop(self,
            slug)
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/python/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/python/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Template, Required | The shop's link name (current or former). |


# Response Type

**200**: The shop.

[`Shop`](/llms-pages/python/models/structures/shop.md)


# Example Usage

```python
slug = 'raptorrush'

result = shops_api.get_shop(slug)
print(result)
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |



