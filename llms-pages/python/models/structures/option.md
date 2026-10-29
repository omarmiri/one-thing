# Option

Source: /#/python/x-redirect/JTI0bSUyRk9wdGlvbg

A suggested option.


# Class Name

`Option`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `name` | `str` | Required | What the buyer is choosing.<br><br>**Constraints**: *Maximum Length*: `20` |
| `kind` | [`Kind`](/llms-pages/python/models/enumerations/kind.md) | Required | `color` shows swatches, and the photo of the picked colour. |
| `values` | [`List[OptionValue]`](/llms-pages/python/models/structures/option-value.md) | Required | The values to pick from.<br><br>**Constraints**: *Minimum Items*: `1`, *Maximum Items*: `12` |
| `from_seller` | `bool` | Optional | The seller's description or photo named these values; otherwise they're a guess. |


# Example

```python
from onethingapi.models.kind import Kind
from onethingapi.models.option import Option
from onethingapi.models.option_value import OptionValue

option = Option(
    name='Size',
    kind=Kind.SIZE,
    values=[
        OptionValue(
            label='S'
        ),
        OptionValue(
            label='M'
        ),
        OptionValue(
            label='L'
        )
    ]
)
```



