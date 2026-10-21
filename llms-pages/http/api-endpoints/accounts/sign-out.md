# Sign Out

Source: /#/http/x-redirect/JTI0ZSUyRkFjY291bnRzJTJGc2lnbk91dA

Ends this browser's session and clears the `ot_session` cookie.

:information_source: **Note** This endpoint does not require authentication.

```http
POST /api/account/signout
```


# Response Type

**200**: Done.

[`Ok`](/llms-pages/http/models/structures/ok.md)


# Example Usage

```bash
curl -X POST \
  --url 'https://one-thing-ash0.onrender.com/api/account/signout'  \
  -H 'Accept: application/json'
```



