# Download File

Source: /#/http/x-redirect/JTI0ZSUyRkZpbGVzJTJGZG93bmxvYWRGaWxl

A paid digital order's private link. Works 5 times within 14 days.

:information_source: **Note** This endpoint does not require authentication.

```http
GET /api/download/{token}
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `token` | `String` | Template, Required | The download token from a paid order's thank-you page. |


# Response Type

**200**: The file.

`Binary`


# Example Usage

```bash
curl -X GET \
  --url 'https://one-thing-ash0.onrender.com/api/download/q2Vd8mLx0RkT4nYb7HcW1sPe'  \
  -H 'Accept: application/octet-stream'
```


# Errors

| HTTP Status Code | Error Description |
|  --- | --- |
| 410 | Expired or used up. |



