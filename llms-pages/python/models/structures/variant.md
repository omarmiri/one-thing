# Variant

Source: /#/python/x-redirect/JTI0bSUyRlZhcmlhbnQ


# Class Name

`Variant`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `choice` | `Dict[str, str]` | Required | The buyer's pick, one value per option, keyed by option name. |
| `availability` | `str` | Required | - |
| `order_url` | `str` | Optional | `orderByLink` for this pick. Left out when it's sold out. |


# Example

```python
from onethingapi.models.variant import Variant

variant = Variant(
    choice={
        'Size': 'M',
        'Color': 'Black'
    },
    availability='availability4',
    order_url='order_url0'
)
```



