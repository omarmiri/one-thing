# Offer

Source: /#/python/x-redirect/JTI0bSUyRk9mZmVy

One store's offer.


# Class Name

`Offer`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `domain` | `str` | Required | The store's domain. |
| `url` | `str` | Required | A Channel3-tracked buy link, credited to this shop. |
| `price` | `float` | Required | The store's price. |
| `currency` | `str` | Required | ISO 4217 currency code. |
| `in_stock` | `bool` | Required | Whether the store has it in stock. |
| `commission` | `float` | Required | Maximum commission rate, 0–1 (0.08 = 8%). |


# Example

```python
from onethingapi.models.offer import Offer

offer = Offer(
    domain='rei.com',
    url='https://buy.trychannel3.com/r/abc123',
    price=240,
    currency='USD',
    in_stock=True,
    commission=0.08
)
```



