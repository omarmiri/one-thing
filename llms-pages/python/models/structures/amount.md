# Amount

Source: /#/python/x-redirect/JTI0bSUyRkFtb3VudA


# Class Name

`Amount`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `item` | `float` | Required | - |
| `shipping` | `float` | Required | - |
| `total` | `float` | Required | - |
| `currency` | `str` | Required | - |


# Example

```python
from onethingapi.models.amount import Amount

amount = Amount(
    item=175.9,
    shipping=226.72,
    total=71.32,
    currency='currency2'
)
```



