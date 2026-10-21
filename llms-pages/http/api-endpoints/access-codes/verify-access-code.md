# Verify Access Code

Source: /#/http/x-redirect/JTI0ZSUyRkFjY2VzcyUyNTIwY29kZXMlMkZ2ZXJpZnlBY2Nlc3NDb2Rl

For apps and games sold with access codes. Callable from any origin (CORS `*`): it only
answers valid or not for one shop, and counts uses. Accepts the shop's current or former
link names, and codes typed loosely (lower case, spaces, no dashes).

:information_source: **Note** This endpoint does not require authentication.

```http
POST /api/access/verify
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `body` | [`Api Access Verify Request`](/llms-pages/http/models/structures/api-access-verify-request.md) | Body, Required | - |


# Response Type

**200**: The answer. Invalid codes are also a 200.

[`Api Access Verify Response`](/llms-pages/http/models/structures/api-access-verify-response.md)


# Example Usage

```bash
curl -X POST \
  --url 'https://one-thing-ash0.onrender.com/api/access/verify'  \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  --data-raw '{
  "shop": "raptorrush",
  "code": "K7QF-M2XP-9HTD"
}'
```



