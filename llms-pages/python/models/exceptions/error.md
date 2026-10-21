# Error

Source: /#/python/x-redirect/JTI0bSUyRkVycm9y


# Class Name

`ErrorException`


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
except ErrorException as e:
    print(e)
except ApiException as e:
    print(e)
```



