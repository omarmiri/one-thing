# Option Value

Source: /#/python/x-redirect/JTI0bSUyRk9wdGlvblZhbHVl


# Class Name

`OptionValue`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `label` | `str` | Required | **Constraints**: *Maximum Length*: `30` |
| `hex` | `str` | Optional | **Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |
| `photo` | `str` | Optional | Colours: the shop photo (id) that shows this colour. See `matchColorPhotos`. |


# Example

```python
from onethingapi.models.option_value import OptionValue

option_value = OptionValue(
    label='M',
    hex='#14171a',
    photo='photo6'
)
```



