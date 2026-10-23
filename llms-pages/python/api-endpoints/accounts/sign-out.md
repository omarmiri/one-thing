# Sign Out

Source: /#/python/x-redirect/JTI0ZSUyRkFjY291bnRzJTJGc2lnbk91dA

Ends this browser's session and clears the `ot_session` cookie.

:information_source: **Note** This endpoint does not require authentication.

```python
def sign_out(self)
```


# Response Type

**200**: Done.

[`Ok`](/llms-pages/python/models/structures/ok.md)


# Example Usage

```python
result = accounts_api.sign_out()
print(result)
```


# Example Response *(as JSON)*

```json
{
  "ok": true
}
```



