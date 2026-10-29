# Disconnect Pay Pal

Source: /#/python/x-redirect/JTI0ZSUyRlNob3BzJTJGZGlzY29ubmVjdFBheVBhbA

Forgets the connected account. Sales go back to the shop's `paypal_email`.

```python
def disconnect_pay_pal(self,
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

result = shops_api.disconnect_pay_pal(slug)
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
| 404 | No such shop, or the admin token or API key doesn't match it. | [`ErrorResponseException`](/llms-pages/python/models/exceptions/error-response.md) |



