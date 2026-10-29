# Fact

Source: /#/python/x-redirect/JTI0bSUyRkZhY3Q

One answered question.


# Class Name

`Fact`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `label` | `str` | Required | The detail's label.<br><br>**Constraints**: *Maximum Length*: `30` |
| `value` | `str` | Required | The answer.<br><br>**Constraints**: *Maximum Length*: `100` |


# Example

```python
from onethingapi.models.fact import Fact

fact = Fact(
    label='Size',
    value='US women\'s 8'
)
```



