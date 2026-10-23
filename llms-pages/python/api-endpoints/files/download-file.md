# Download File

Source: /#/python/x-redirect/JTI0ZSUyRkZpbGVzJTJGZG93bmxvYWRGaWxl

A paid digital order's private link. Works 5 times within 14 days.

:information_source: **Note** This endpoint does not require authentication.

```python
def download_file(self,
                 token)
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `token` | `str` | Template, Required | The download token from a paid order's thank-you page. |


# Response Type

**200**: The file.

`binary`


# Example Usage

```python
token = 'q2Vd8mLx0RkT4nYb7HcW1sPe'

result = files_api.download_file(token)
print(result)
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 410 | Expired or used up. | `ApiException` |



