# Ship To

Source: /#/python/x-redirect/JTI0bSUyRlNoaXBUbw

Where it ships, from the buyer's PayPal checkout. Null if PayPal didn't share it.


# Class Name

`ShipTo`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `name` | `str` | Optional | The recipient's name. |
| `address` | `str` | Optional | The address on one line. |


# Example

```python
from onethingapi.models.ship_to import ShipTo

ship_to = ShipTo(
    name='Sam Rivera',
    address='1 Main St, Springfield, IL, 62701, US'
)
```



