# Option

Source: /#/python/x-redirect/JTI0bSUyRk9wdGlvbg


# Class Name

`Option`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `name` | `str` | Required | **Constraints**: *Maximum Length*: `20` |
| `kind` | [`Kind`](/llms-pages/python/models/enumerations/kind.md) | Required | `color` shows swatches, and the photo of the picked colour. |
| `values` | [`List[OptionValue]`](/llms-pages/python/models/structures/option-value.md) | Required | **Constraints**: *Minimum Items*: `1`, *Maximum Items*: `12` |
| `from_seller` | `bool` | Optional | The seller's description or photo named these values; otherwise they're a guess. |


# Example

```python
from onethingapi.models.kind import Kind
from onethingapi.models.option import Option
from onethingapi.models.option_value import OptionValue

option = Option(
    name='Size',
    kind=Kind.COLOR,
    values=[
        OptionValue(
            label='M',
            hex='#14171a',
            photo='photo6'
        )
    ],
    from_seller=False
)
```



