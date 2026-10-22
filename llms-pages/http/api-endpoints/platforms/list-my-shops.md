# List My Shops

Source: /#/http/x-redirect/JTI0ZSUyRlBsYXRmb3JtcyUyRmxpc3RNeVNob3Bz

Every shop the API key's account owns, newest first, with what a catalog page needs: name, price, cover, link, whether PayPal is connected and how many sales it has.

```http
GET /api/platform/shops
```


# Authentication

This endpoint requires [PlatformKey](/llms-pages/http/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `status` | [`Status`](/llms-pages/http/models/enumerations/status.md) | Query, Optional | Only shops with this status, e.g. `live` for a public catalog. |


# Response Type

**200**: The shops.

[`Api Platform Shops Response`](/llms-pages/http/models/structures/api-platform-shops-response.md)


# Example Usage

```bash
curl -X GET -G \
  --url 'https://one-thing-ash0.onrender.com/api/platform/shops'  \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer AccessToken'
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 401 | No API key, or it's wrong or revoked. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |



