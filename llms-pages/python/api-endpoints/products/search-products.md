# Search Products

Source: /#/python/x-redirect/JTI0ZSUyRlByb2R1Y3RzJTJGc2VhcmNoUHJvZHVjdHM

Searches 100M+ products from 25k+ stores through Channel3. Pass a result's `id` to `createShop` with `source=channel3`.

:information_source: **Note** This endpoint does not require authentication.

```python
def search_products(self,
                   q)
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `q` | `str` | Query, Required | What to look for, in plain words.<br><br>**Constraints**: *Maximum Length*: `200` |


# Response Type

**200**: Up to 12 products.

[`ApiChannel3SearchResponse`](/llms-pages/python/models/structures/api-channel-3-search-response.md)


# Example Usage

```python
q = 'gifts for trail runners under $60'

result = products_api.search_products(q)
print(result)
```


# Example Response *(as JSON)*

```json
{
  "products": [
    {
      "id": "ch3_7f2a9c1e",
      "title": "Trail Running Vest 5L",
      "brand": "Salomon",
      "image": "https://images.example.com/vest.jpg",
      "price": 59.99,
      "currency": "USD",
      "retailer": "rei.com",
      "retailers": 4,
      "commission": 0.08
    }
  ]
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 503 | Gemini, PayPal or Channel3 failed or isn't configured. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |



