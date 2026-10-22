# Log In with Pay Pal

Source: /#/http/x-redirect/JTI0ZSUyRkFjY291bnRzJTJGbG9nSW5XaXRoUGF5UGFs

A link for a browser, not for code: redirects to PayPal's sign-in page. PayPal sends the seller back to `/api/account/paypal/callback`, which signs them in (creating the account the first time), records the PayPal account their sales are paid into, and redirects to `next`.

:information_source: **Note** This endpoint does not require authentication.

```http
GET /api/account/paypal
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `next` | `String` | Query, Optional | A path on this site to land on afterwards. Defaults to `/account`. |


# Response Type

**302**: To PayPal's sign-in page.

`Void`


# Example Usage

```bash
curl -X GET -G \
  --url 'https://one-thing-ash0.onrender.com/api/account/paypal'  \
  -d 'next=%2Fnew'
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 503 | Log in with PayPal isn't switched on for this server. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |



