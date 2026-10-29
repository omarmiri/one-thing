# Palette

Source: /#/python/x-redirect/JTI0bSUyRlBhbGV0dGU

The page colours, taken from the photo. Text colours are checked for contrast.


# Class Name

`Palette`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `background` | `str` | Required | A colour as `#rrggbb`.<br><br>**Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |
| `surface` | `str` | Required | A colour as `#rrggbb`.<br><br>**Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |
| `text` | `str` | Required | A colour as `#rrggbb`.<br><br>**Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |
| `muted` | `str` | Required | A colour as `#rrggbb`.<br><br>**Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |
| `accent` | `str` | Required | A colour as `#rrggbb`.<br><br>**Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |
| `accent_text` | `str` | Required | A colour as `#rrggbb`.<br><br>**Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |


# Example

```python
from onethingapi.models.palette import Palette

palette = Palette(
    background='#f7f1e8',
    surface='#ffffff',
    text='#1f1a17',
    muted='#6b625b',
    accent='#b3262d',
    accent_text='#ffffff'
)
```



