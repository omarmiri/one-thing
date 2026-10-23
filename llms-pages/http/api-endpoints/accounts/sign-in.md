# Sign In

Source: /#/http/x-redirect/JTI0ZSUyRkFjY291bnRzJTJGc2lnbklu

Signs in with an email address or a phone number, creating the account the first time. There's no password and no verification (sandbox). The response sets the `ot_session` cookie; shops created with it belong to the account and are listed on `/account`. Signing in with an email also claims older shops whose seller email matches. In a browser, sellers can instead use Log in with PayPal (`/api/account/paypal`), which also records the PayPal account their sales are paid into.

:information_source: **Note** This endpoint does not require authentication.

```http
POST /api/account/signin
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `body` | [`Api Account Signin Request`](/llms-pages/http/models/structures/api-account-signin-request.md) | Body, Required | - |


# Response Type

**200**: Signed in. The `ot_session` cookie is set.

[`Api Account Signin Response`](/llms-pages/http/models/structures/api-account-signin-response.md)


# Example Usage

```bash
curl -X POST \
  --url 'https://one-thing-ash0.onrender.com/api/account/signin'  \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  --data-raw '{
  "identifier": "maker@example.com"
}'
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
| 400 | Something in the request needs fixing; `error` says what. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |



