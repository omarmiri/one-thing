# Color

Source: /#/python/x-redirect/JTI0bSUyRkNvbG9y

One colour.


# Class Name

`Color`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `label` | `str` | Required | The colour's name, as buyers see it.<br><br>**Constraints**: *Maximum Length*: `30` |
| `hex` | `str` | Optional | A colour as `#rrggbb`.<br><br>**Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |


# Example

```python
from onethingapi.models.color import Color

color = Color(
    label='Ice Blue',
    hex='#9fd3e6'
)
```



