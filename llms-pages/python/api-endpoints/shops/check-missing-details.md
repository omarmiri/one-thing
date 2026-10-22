# Check Missing Details

Source: /#/python/x-redirect/JTI0ZSUyRlNob3BzJTJGY2hlY2tNaXNzaW5nRGV0YWlscw

Asks Gemini what buyers will want to choose (sizes, colours) and what they'll ask that the
listing doesn't say (dimensions, materials). `createShop` already does this once; call it
again after editing the product. The result is saved as the shop's `suggestions`.

Nothing changes on the shop page until the seller confirms: save options with `updateShop`
(`options`), and answer the questions with `updateShop` (`facts`). Not for recommendations.

```python
def check_missing_details(self,
                         slug)
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/python/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/python/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Template, Required | The shop's link name (current or former). |


# Response Type

**200**: The suggestions.

[`Suggestions`](/llms-pages/python/models/structures/suggestions.md)


# Example Usage

```python
slug = 'raptorrush'

result = shops_api.check_missing_details(slug)
print(result)
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |



