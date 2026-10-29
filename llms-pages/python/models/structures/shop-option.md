# Shop Option

Source: /#/python/x-redirect/JTI0bSUyRlNob3BPcHRpb24

Something the buyer picks, such as a size or a colour. The shop still sells one product.


# Class Name

`ShopOption`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `name` | `str` | Required | What the buyer is choosing.<br><br>**Constraints**: *Maximum Length*: `20` |
| `kind` | [`Kind`](/llms-pages/python/models/enumerations/kind.md) | Required | `color` shows swatches, and the photo of the picked colour. |
| `values` | [`List[OptionValue]`](/llms-pages/python/models/structures/option-value.md) | Required | The values to pick from.<br><br>**Constraints**: *Minimum Items*: `1`, *Maximum Items*: `12` |


# Example

```python
from onethingapi.models.kind import Kind
from onethingapi.models.option_value import OptionValue
from onethingapi.models.shop_option import ShopOption

shop_option = ShopOption(
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



