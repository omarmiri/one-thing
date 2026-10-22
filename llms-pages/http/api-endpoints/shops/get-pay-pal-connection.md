# Get Pay Pal Connection

Source: /#/http/x-redirect/JTI0ZSUyRlNob3BzJTJGZ2V0UGF5UGFsQ29ubmVjdGlvbg

Asks PayPal where the seller's connection stands and saves it on the shop. Also finds a connection the seller finished at PayPal without coming back.

```http
GET /api/shops/{slug}/paypal
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/http/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Template, Required | The shop's link name (current or former). |


# Response Type

**200**: The connection, or nulls if there is none yet.

[`Api Shops Paypal Response 1`](/llms-pages/http/models/structures/api-shops-paypal-response-1.md)


# Example Usage

```bash
curl -X GET \
  --url 'https://one-thing-ash0.onrender.com/api/shops/raptorrush/paypal'  \
  -H 'Accept: application/json' \
  -H 'x-admin-token: x-admin-token'
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | No such shop, or the admin token doesn't match it. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |
| 503 | Gemini, PayPal or Channel3 failed or isn't configured. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |



