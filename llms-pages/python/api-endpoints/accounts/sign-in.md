# Sign In

Source: /#/python/x-redirect/JTI0ZSUyRkFjY291bnRzJTJGc2lnbklu

Signs in with an email address or a phone number, creating the account the first time. There's no password and no verification (sandbox). The response sets the `ot_session` cookie; shops created with it belong to the account and are listed on `/account`. Signing in with an email also claims older shops whose seller email matches. In a browser, sellers can instead use Log in with PayPal (`/api/account/paypal`), which also records the PayPal account their sales are paid into.

:information_source: **Note** This endpoint does not require authentication.

```python
def sign_in(self,
           body)
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `body` | [`ApiAccountSigninRequest`](/llms-pages/python/models/structures/api-account-signin-request.md) | Body, Required | The email or phone number to sign in with. |


# Response Type

**200**: Signed in. The `ot_session` cookie is set.

[`ApiAccountSigninResponse`](/llms-pages/python/models/structures/api-account-signin-response.md)


# Example Usage

```python
body = ApiAccountSigninRequest(
    identifier='maker@example.com'
)

result = accounts_api.sign_in(body)
print(result)
```


# Example Response *(as JSON)*

```json
{
  "id": "Vq3nN8cT0bLx2YwE",
  "email": "maker@example.com",
  "phone": null
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`ErrorResponseException`](/llms-pages/python/models/exceptions/error-response.md) |



