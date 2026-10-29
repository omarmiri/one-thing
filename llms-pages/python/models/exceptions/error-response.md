# Error Response

Source: /#/python/x-redirect/JTI0bSUyRkVycm9yUmVzcG9uc2U

An error reply.


# Class Name

`ErrorResponseException`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `error` | `str` | Required | A sentence you can show to a person. |
| `field` | `str` | Optional | The form field at fault, when there is one. |
| `detail` | `str` | Optional | The upstream service's own message, for debugging. |


# Example

```python
try:
    # make the API call
except ErrorResponseException as e:
    print(e)
except ApiException as e:
    print(e)
```



