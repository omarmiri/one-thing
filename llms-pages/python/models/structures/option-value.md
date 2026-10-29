# Option Value

Source: /#/python/x-redirect/JTI0bSUyRk9wdGlvblZhbHVl

One value of an option.


# Class Name

`OptionValue`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `label` | `str` | Required | What the buyer sees and picks.<br><br>**Constraints**: *Maximum Length*: `30` |
| `hex` | `str` | Optional | A colour as `#rrggbb`.<br><br>**Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |
| `photo` | `str` | Optional | Colours: the shop photo (id) that shows this colour. See `matchColorPhotos`. |


# Example

```python
from onethingapi.models.option_value import OptionValue

option_value = OptionValue(
    label='M',
    hex='#14171a',
    photo='zrySajNyao6_j11x'
)
```



