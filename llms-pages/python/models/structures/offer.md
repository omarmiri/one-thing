# Offer

Source: /#/python/x-redirect/JTI0bSUyRk9mZmVy


# Class Name

`Offer`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `domain` | `str` | Required | - |
| `url` | `str` | Required | - |
| `price` | `float` | Required | - |
| `currency` | `str` | Required | - |
| `in_stock` | `bool` | Required | - |
| `commission` | `float` | Required | Maximum commission rate, 0–1 (0.08 = 8%). |


# Example

```python
from onethingapi.models.offer import Offer

offer = Offer(
    domain='domain0',
    url='url8',
    price=136.68,
    currency='currency6',
    in_stock=False,
    commission=5.02
)
```



