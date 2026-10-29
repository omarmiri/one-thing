# Offer 1

Source: /#/python/x-redirect/JTI0bSUyRk9mZmVyMQ

One store's offer.


# Class Name

`Offer1`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `retailer` | `str` | Required | The store. |
| `price` | `float` | Required | The store's price. |
| `currency` | `str` | Required | ISO 4217 currency code. |
| `in_stock` | `bool` | Required | Whether the store has it in stock. |
| `url` | `str` | Required | A tracked buy link at that store. |


# Example

```python
from onethingapi.models.offer_1 import Offer1

offer_1 = Offer1(
    retailer='rei.com',
    price=240,
    currency='USD',
    in_stock=True,
    url='https://buy.trychannel3.com/r/abc123'
)
```



