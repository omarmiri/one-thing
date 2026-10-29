# Get Pay Pal Client Token

Source: /#/python/x-redirect/JTI0ZSUyRkNoZWNrb3V0JTJGZ2V0UGF5UGFsQ2xpZW50VG9rZW4

A browser-safe client token for the PayPal JavaScript SDK v6
(`paypal.createInstance({ clientToken })`), bound to the requesting site's domain.
Shop pages call this before showing the PayPal button.

:information_source: **Note** This endpoint does not require authentication.

```python
def get_pay_pal_client_token(self)
```


# Response Type

**200**: A token for this site's domain.

[`ApiPaypalClientTokenResponse`](/llms-pages/python/models/structures/api-paypal-client-token-response.md)


# Example Usage

```python
result = checkout_api.get_pay_pal_client_token()
print(result)
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
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`ErrorResponseException`](/llms-pages/python/models/exceptions/error-response.md) |
| 503 | Gemini, PayPal or Channel3 failed or isn't configured. | [`ErrorResponseException`](/llms-pages/python/models/exceptions/error-response.md) |



