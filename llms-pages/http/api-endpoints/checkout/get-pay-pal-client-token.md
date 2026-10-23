# Get Pay Pal Client Token

Source: /#/http/x-redirect/JTI0ZSUyRkNoZWNrb3V0JTJGZ2V0UGF5UGFsQ2xpZW50VG9rZW4

A browser-safe client token for the PayPal JavaScript SDK v6
(`paypal.createInstance({ clientToken })`), bound to the requesting site's domain.
Shop pages call this before showing the PayPal button.

:information_source: **Note** This endpoint does not require authentication.

```http
GET /api/paypal/client-token
```


# Response Type

**200**: A token for this site's domain.

[`Api Paypal Client Token Response`](/llms-pages/http/models/structures/api-paypal-client-token-response.md)


# Example Usage

```bash
curl -X GET \
  --url 'https://one-thing-ash0.onrender.com/api/paypal/client-token'  \
  -H 'Accept: application/json'
```


# Example Response *(as JSON)*

```json
{
  "clientToken": "eyJraWQiOiJFWEFNUExFIn0.example.client-token"
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |
| 503 | Gemini, PayPal or Channel3 failed or isn't configured. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |



