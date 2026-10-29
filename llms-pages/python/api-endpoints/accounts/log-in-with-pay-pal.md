# Log In with Pay Pal

Source: /#/python/x-redirect/JTI0ZSUyRkFjY291bnRzJTJGbG9nSW5XaXRoUGF5UGFs

A link for a browser, not for code: redirects to PayPal's sign-in page. PayPal sends the seller back to `/api/account/paypal/callback`, which signs them in (creating the account the first time), records the PayPal account their sales are paid into, and redirects to `next`.

:information_source: **Note** This endpoint does not require authentication.

```python
def log_in_with_pay_pal(self,
                       next=None)
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `next` | `str` | Query, Optional | A path on this site to land on afterwards. Defaults to `/account`. |


# Response Type

**200**

`void`


# Example Usage

```python
next = '/account'

accounts_api.log_in_with_pay_pal(
    next=next
)
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 503 | Log in with PayPal isn't switched on for this server. | [`ErrorResponseException`](/llms-pages/python/models/exceptions/error-response.md) |



