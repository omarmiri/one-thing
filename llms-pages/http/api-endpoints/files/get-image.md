# Get Image

Source: /#/http/x-redirect/JTI0ZSUyRkZpbGVzJTJGZ2V0SW1hZ2U

Public images only. Purchased files are never served here.

:information_source: **Note** This endpoint does not require authentication.

```http
GET /api/blobs/{id}
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `String` | Template, Required | A shop's `photo_blob` or `hero_blob`. |


# Response Type

**200**: The image.

`Any`


# Example Usage

```bash
curl -X GET \
  --url 'https://one-thing-ash0.onrender.com/api/blobs/LFRvGuTU3D8i334X'  \
  -H 'Accept: image/*'
```


# Errors

| HTTP Status Code | Error Description |
|  --- | --- |
| 404 | Not a public shop image. |



