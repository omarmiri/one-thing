# Color

Source: /#/python/x-redirect/JTI0bSUyRkNvbG9y


# Class Name

`Color`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `label` | `str` | Required | **Constraints**: *Maximum Length*: `30` |
| `hex` | `str` | Optional | **Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |


# Example

```python
from onethingapi.models.color import Color

color = Color(
    label='Forest green',
    hex='#14171a'
)
```



