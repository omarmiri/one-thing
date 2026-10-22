# List My Shops

Source: /#/python/x-redirect/JTI0ZSUyRlBsYXRmb3JtcyUyRmxpc3RNeVNob3Bz

Every shop the API key's account owns, newest first, with what a catalog page needs: name, price, cover, link, whether PayPal is connected and how many sales it has.

```python
def list_my_shops(self,
                 status=None)
```


# Authentication

This endpoint requires [PlatformKey](/llms-pages/python/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `status` | [`Status`](/llms-pages/python/models/enumerations/status.md) | Query, Optional | Only shops with this status, e.g. `live` for a public catalog. |


# Response Type

**200**: The shops.

[`ApiPlatformShopsResponse`](/llms-pages/python/models/structures/api-platform-shops-response.md)


# Example Usage

```python
result = platforms_api.list_my_shops()
print(result)
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 401 | No API key, or it's wrong or revoked. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |



