# Tracking

Source: /#/python/x-redirect/JTI0bSUyRlRyYWNraW5n

The carrier and tracking number once shipped; null before.


# Class Name

`Tracking`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `carrier` | `str` | Optional | The shipping carrier. |
| `number` | `str` | Optional | The tracking number. |


# Example

```python
from onethingapi.models.tracking import Tracking

tracking = Tracking(
    carrier='USPS',
    number='9400111899223197428490'
)
```



