# Get Image

Source: /#/python/x-redirect/JTI0ZSUyRkZpbGVzJTJGZ2V0SW1hZ2U

Public images only. Purchased files are never served here.

:information_source: **Note** This endpoint does not require authentication.

```python
def get_image(self,
             id)
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `str` | Template, Required | A shop's `photo_blob` or `hero_blob`. |


# Response Type

**200**: The image.

`Any`


# Example Usage

```python
id = 'LFRvGuTU3D8i334X'

result = files_api.get_image(id)
print(result)
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | Not a public shop image. | `ApiException` |



