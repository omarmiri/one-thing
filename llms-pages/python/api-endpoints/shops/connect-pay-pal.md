# Connect Pay Pal

Source: /#/python/x-redirect/JTI0ZSUyRlNob3BzJTJGY29ubmVjdFBheVBhbA

Starts PayPal's seller onboarding (Partner Referrals). Send the seller's browser to the
returned `url`; they sign in to PayPal (or create a business account) and grant OneThing
permission. PayPal brings them back to `/api/shops/<slug>/paypal/return`, which saves the
connection and opens the manage page. From then on, sales are paid to that account.

Without a connection, a shop can still go live with a typed `paypal_email`.

**Platforms:** call it with your API key and a `returnUrl`, and PayPal's flow ends on your own
page instead, as `returnUrl?paypal=connected|incomplete|cancelled|failed&shop=<slug>`. The
URL's origin must be one registered on the key.

```python
def connect_pay_pal(self,
                   slug,
                   body=None)
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/python/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/python/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Template, Required | The shop's link name (current or former). |
| `body` | [`ApiShopsPaypalRequest`](/llms-pages/python/models/structures/api-shops-paypal-request.md) | Body, Optional | - |


# Response Type

**200**: Where to send the seller.

[`ApiShopsPaypalResponse`](/llms-pages/python/models/structures/api-shops-paypal-response.md)


# Example Usage

```python
slug = 'raptorrush'

body = ApiShopsPaypalRequest(
    return_url='https://www.miriogames.com/market/manage/?g=7Hq2'
)

result = shops_api.connect_pay_pal(
    slug,
    body=body
)
print(result)
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
| 404 | No such shop, or the admin token or API key doesn't match it. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 503 | Gemini, PayPal or Channel3 failed or isn't configured. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |



