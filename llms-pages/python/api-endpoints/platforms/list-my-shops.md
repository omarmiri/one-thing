# List My Shops

Source: /#/python/x-redirect/JTI0ZSUyRlBsYXRmb3JtcyUyRmxpc3RNeVNob3Bz

Every shop the API key's account owns, newest first, with what a catalog page needs: name, price, cover, link, whether PayPal is connected and how many sales it has.

```python
def list_my_shops(self,
                 status=None)
```


# Authentication

This endpoint requires [PlatformKey](/llms-pages/python/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `status` | [`Status`](/llms-pages/python/models/enumerations/status.md) | Query, Optional | Only shops with this status, e.g. `live` for a public catalog. |


# Response Type

**200**: The shops.

[`ApiPlatformShopsResponse`](/llms-pages/python/models/structures/api-platform-shops-response.md)


# Example Usage

```python
status = Status.LIVE

result = platforms_api.list_my_shops(
    status=status
)
print(result)
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
| 401 | No API key, or it's wrong or revoked. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |



