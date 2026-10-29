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
| `status` | [`Status 5`](/llms-pages/http/models/enumerations/status-5.md) | Query, Optional | Only shops with this status, e.g. `live` for a public catalog. |


# Response Type

**200**: The shops.

[`Api Platform Shops Response`](/llms-pages/http/models/structures/api-platform-shops-response.md)


# Example Usage

```bash
curl -X GET -G \
  --url 'https://one-thing-ash0.onrender.com/api/platform/shops'  \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer AccessToken' \
  -d 'status=live'
```


# Example Response *(as JSON)*

```json
{
  "shops": [
    {
      "slug": "raptorrush",
      "status": "live",
      "name": "Raptor Rush: Browser Edition",
      "headline": "Grow from Tiny Hatchling to Giant Apex Predator",
      "product_type": "digital",
      "price": {
        "amount": 2.99,
        "currency": "USD"
      },
      "url": "https://one-thing-ash0.onrender.com/raptorrush",
      "cover": "https://one-thing-ash0.onrender.com/api/blobs/KchAi9jwZzo76SKh",
      "paypal_connected": true,
      "sales": 12,
      "created_at": "2026-10-12T20:31:44Z"
    }
  ]
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 401 | No API key, or it's wrong or revoked. | [`ErrorResponse_ErrorException`](/llms-pages/http/models/exceptions/error-response-error.md) |



