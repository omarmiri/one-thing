# Disconnect Pay Pal

Source: /#/http/x-redirect/JTI0ZSUyRlNob3BzJTJGZGlzY29ubmVjdFBheVBhbA

Forgets the connected account. Sales go back to the shop's `paypal_email`.

```http
DELETE /api/shops/{slug}/paypal
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/http/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Template, Required | The shop's link name (current or former). |


# Response Type

**200**: Done.

[`Ok`](/llms-pages/http/models/structures/ok.md)


# Example Usage

```bash
curl -X DELETE \
  --url 'https://one-thing-ash0.onrender.com/api/shops/raptorrush/paypal'  \
  -H 'Accept: application/json' \
  -H 'x-admin-token: x-admin-token'
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | No such shop, or the admin token doesn't match it. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |



