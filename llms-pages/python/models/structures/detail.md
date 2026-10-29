# Detail

Source: /#/python/x-redirect/JTI0bSUyRkRldGFpbA

One product fact.


# Class Name

`Detail`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `label` | `str` | Required | What the fact is about. |
| `value` | `str` | Required | The fact. |


# Example

```python
from onethingapi.models.detail import Detail

detail = Detail(
    label='Material',
    value='Leather upper, walnut burl heel, rubber wheels'
)
```



