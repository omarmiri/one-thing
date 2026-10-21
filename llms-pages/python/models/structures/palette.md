# Palette

Source: /#/python/x-redirect/JTI0bSUyRlBhbGV0dGU


# Class Name

`Palette`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `background` | `str` | Required | **Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |
| `surface` | `str` | Required | **Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |
| `text` | `str` | Required | **Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |
| `muted` | `str` | Required | **Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |
| `accent` | `str` | Required | **Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |
| `accent_text` | `str` | Required | **Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |


# Example

```python
from onethingapi.models.palette import Palette

palette = Palette(
    background='#14171a',
    surface='#14171a',
    text='#14171a',
    muted='#14171a',
    accent='#14171a',
    accent_text='#14171a'
)
```



