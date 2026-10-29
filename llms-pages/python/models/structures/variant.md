# Variant

Source: /#/python/x-redirect/JTI0bSUyRlZhcmlhbnQ

One combination of option values.


# Class Name

`Variant`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `choice` | `Dict[str, str]` | Required | The buyer's pick, one value per option, keyed by option name. |
| `availability` | `str` | Required | `in_stock`, `in_stock (N left)` or `sold_out`. |
| `order_url` | `str` | Optional | `orderByLink` for this pick. Left out when it's sold out. |


# Example

```python
from onethingapi.models.variant import Variant

variant = Variant(
    choice={
        'Size': 'M',
        'Color': 'Black'
    },
    availability='in_stock (3 left)',
    order_url='https://one-thing-ash0.onrender.com/vintageskates/buy?Size=9'
)
```



