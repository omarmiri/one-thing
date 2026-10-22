# Shipping

Source: /#/python/x-redirect/JTI0bSUyRlNoaXBwaW5n


# Class Name

`Shipping`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `amount` | `float` | Required | - |
| `currency` | `str` | Required | - |
| `ships_to` | `List[str]` | Required | Country codes; empty means anywhere PayPal ships. |


# Example

```python
from onethingapi.models.shipping import Shipping

shipping = Shipping(
    amount=113.16,
    currency='currency4',
    ships_to=[
        'ships_to7',
        'ships_to8',
        'ships_to9'
    ]
)
```



