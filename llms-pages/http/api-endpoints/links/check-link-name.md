# Check Link Name

Source: /#/http/x-redirect/JTI0ZSUyRkxpbmtzJTJGY2hlY2tMaW5rTmFtZQ

Normalises a proposed link name and says whether a new shop can use it.

:information_source: **Note** This endpoint does not require authentication.

```http
GET /api/slugs/check
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `name` | `String` | Query, Required | Anything; it is normalised (`Raptor Rush` becomes `raptor-rush`). |


# Response Type

**200**: The normalised name and whether it can be used.

[`Api Slugs Check Response`](/llms-pages/http/models/structures/api-slugs-check-response.md)


# Example Usage

```bash
curl -X GET -G \
  --url 'https://one-thing-ash0.onrender.com/api/slugs/check'  \
  -H 'Accept: application/json' \
  -d 'name=Raptor+Rush'
```


# Example Response *(as JSON)*

```json
{
  "slug": "raptor-rush",
  "available": true
}
```



