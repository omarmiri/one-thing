# Get Pay Pal Connection

Source: /#/python/x-redirect/JTI0ZSUyRlNob3BzJTJGZ2V0UGF5UGFsQ29ubmVjdGlvbg

Asks PayPal where the seller's connection stands and saves it on the shop. Also finds a connection the seller finished at PayPal without coming back.

```python
def get_pay_pal_connection(self,
                          slug)
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/python/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/python/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Template, Required | The shop's link name (current or former). |


# Response Type

**200**: The connection, or nulls if there is none yet.

[`ApiShopsPaypalResponse1`](/llms-pages/python/models/structures/api-shops-paypal-response-1.md)


# Example Usage

```python
slug = 'raptorrush'

result = shops_api.get_pay_pal_connection(slug)
print(result)
```


# Example Response *(as JSON)*

```json
{
  "merchantId": "7MZJ4QXN8K2LA",
  "status": {
    "receivable": true,
    "emailConfirmed": true,
    "checkedAt": "2026-10-21T18:04:11Z"
  }
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 503 | Gemini, PayPal or Channel3 failed or isn't configured. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |



