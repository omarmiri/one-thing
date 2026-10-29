# Created Shop

Source: /#/http/x-redirect/JTI0bSUyRkNyZWF0ZWRTaG9w

The new draft shop and the credentials to manage it.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Required | The shop's link name: the page is `https://<host>/<slug>`. |
| `token` | `String` | Required | The admin token. Shown once; store it. |
| `manageUrl` | `String` | Required | The seller's private manage page (contains the token). |


# Example (as JSON)

```json
{
  "slug": "dragonflight",
  "token": "3fJ9xQm2LwP8vR1tZk7cN4bY6dHs0aEu",
  "manageUrl": "/manage/vintageskates?token=3fJ9xQm2LwP8vR1tZk7cN4bY6dHs0aEu"
}
```



