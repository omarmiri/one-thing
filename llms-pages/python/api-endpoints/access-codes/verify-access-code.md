# Verify Access Code

Source: /#/python/x-redirect/JTI0ZSUyRkFjY2VzcyUyNTIwY29kZXMlMkZ2ZXJpZnlBY2Nlc3NDb2Rl

For apps and games sold with access codes. Callable from any origin (CORS `*`): it only
answers valid or not for one shop, and counts uses. Accepts the shop's current or former
link names, and codes typed loosely (lower case, spaces, no dashes).

:information_source: **Note** This endpoint does not require authentication.

```python
def verify_access_code(self,
                      body)
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `body` | [`ApiAccessVerifyRequest`](/llms-pages/python/models/structures/api-access-verify-request.md) | Body, Required | - |


# Response Type

**200**: The answer. Invalid codes are also a 200.

[`ApiAccessVerifyResponse`](/llms-pages/python/models/structures/api-access-verify-response.md)


# Example Usage

```python
body = ApiAccessVerifyRequest(
    shop='raptorrush',
    code='K7QF-M2XP-9HTD'
)

result = access_codes_api.verify_access_code(body)
print(result)
```



