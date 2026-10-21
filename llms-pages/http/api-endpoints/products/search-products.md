# Search Products

Source: /#/http/x-redirect/JTI0ZSUyRlByb2R1Y3RzJTJGc2VhcmNoUHJvZHVjdHM

Searches 100M+ products from 25k+ stores through Channel3. Pass a result's `id` to `createShop` with `source=channel3`.

:information_source: **Note** This endpoint does not require authentication.

```http
GET /api/channel3/search
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `q` | `String` | Query, Required | What to look for, in plain words.<br><br>**Constraints**: *Maximum Length*: `200` |


# Response Type

**200**: Up to 12 products.

[`Api Channel 3 Search Response`](/llms-pages/http/models/structures/api-channel-3-search-response.md)


# Example Usage

```bash
curl -X GET -G \
  --url 'https://one-thing-ash0.onrender.com/api/channel3/search'  \
  -H 'Accept: application/json' \
  -d 'q=gifts+for+trail+runners+under+%2460'
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |
| 503 | Gemini, PayPal or Channel3 failed or isn't configured. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |



