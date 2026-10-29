# Amount

Source: /#/python/x-redirect/JTI0bSUyRkFtb3VudA

What the order costs, as numbers.


# Class Name

`Amount`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `item` | `float` | Required | The product's price. |
| `shipping` | `float` | Required | Shipping; 0 for digital products. |
| `total` | `float` | Required | Product plus shipping: what the buyer pays. |
| `currency` | `str` | Required | ISO 4217 currency code. |


# Example

```python
from onethingapi.models.amount import Amount

amount = Amount(
    item=240,
    shipping=15,
    total=255,
    currency='USD'
)
```



