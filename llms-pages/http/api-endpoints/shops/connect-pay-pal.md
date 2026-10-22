# Connect Pay Pal

Source: /#/http/x-redirect/JTI0ZSUyRlNob3BzJTJGY29ubmVjdFBheVBhbA

Starts PayPal's seller onboarding (Partner Referrals). Send the seller's browser to the
returned `url`; they sign in to PayPal (or create a business account) and grant OneThing
permission. PayPal brings them back to `/api/shops/<slug>/paypal/return`, which saves the
connection and opens the manage page. From then on, sales are paid to that account.

Without a connection, a shop can still go live with a typed `paypal_email`.

```http
POST /api/shops/{slug}/paypal
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/http/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Template, Required | The shop's link name (current or former). |


# Response Type

**200**: Where to send the seller.

[`Api Shops Paypal Response`](/llms-pages/http/models/structures/api-shops-paypal-response.md)


# Example Usage

```bash
curl -X POST \
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



