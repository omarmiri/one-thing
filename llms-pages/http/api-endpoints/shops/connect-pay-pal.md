# Connect Pay Pal

Source: /#/http/x-redirect/JTI0ZSUyRlNob3BzJTJGY29ubmVjdFBheVBhbA

Starts PayPal's seller onboarding (Partner Referrals). Send the seller's browser to the
returned `url`; they sign in to PayPal (or create a business account) and grant OneThing
permission. PayPal brings them back to `/api/shops/<slug>/paypal/return`, which saves the
connection and opens the manage page. From then on, sales are paid to that account.

Without a connection, a shop can still go live with a typed `paypal_email`.

**Platforms:** call it with your API key and a `returnUrl`, and PayPal's flow ends on your own
page instead, as `returnUrl?paypal=connected|incomplete|cancelled|failed&shop=<slug>`. The
URL's origin must be one registered on the key.

```http
POST /api/shops/{slug}/paypal
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/http/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/http/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Template, Required | The shop's link name (current or former). |
| `body` | [`Api Shops Paypal Request`](/llms-pages/http/models/structures/api-shops-paypal-request.md) | Body, Optional | - |


# Response Type

**200**: Where to send the seller.

[`Api Shops Paypal Response`](/llms-pages/http/models/structures/api-shops-paypal-response.md)


# Example Usage

```bash
curl -X POST \
  --url 'https://one-thing-ash0.onrender.com/api/shops/raptorrush/paypal'  \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'x-admin-token: x-admin-token' \
  -H 'Authorization: Bearer AccessToken' \
  --data-raw '{
  "returnUrl": "https://www.miriogames.com/market/manage/?g=7Hq2"
}'
```


# Example Response *(as JSON)*

```json
{
  "url": "https://www.sandbox.paypal.com/bizsignup/partner/entry?referralToken=EXAMPLE"
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |
| 503 | Gemini, PayPal or Channel3 failed or isn't configured. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |



