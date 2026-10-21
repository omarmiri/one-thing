# Get Shop

Source: /#/http/x-redirect/JTI0ZSUyRlNob3BzJTJGZ2V0U2hvcA

Everything about the shop, including the AI's design spec and guesses.

```http
GET /api/shops/{slug}
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/http/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Template, Required | The shop's link name (current or former). |


# Response Type

**200**: The shop.

[`Shop`](/llms-pages/http/models/structures/shop.md)


# Example Usage

```bash
curl -X GET \
  --url 'https://one-thing-ash0.onrender.com/api/shops/raptorrush'  \
  -H 'Accept: application/json' \
  -H 'x-admin-token: x-admin-token'
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | No such shop, or the admin token doesn't match it. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |



