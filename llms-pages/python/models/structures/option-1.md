# Option 1

Source: /#/python/x-redirect/JTI0bSUyRk9wdGlvbjE

One option and its values.


# Class Name

`Option1`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `name` | `str` | Required | The option's name, which is also its query parameter on `order_url`. |
| `values` | `List[str]` | Required | The values the buyer can pick. |


# Example

```python
from onethingapi.models.option_1 import Option1

option_1 = Option1(
    name='Size',
    values=[
        '7',
        '8',
        '9'
    ]
)
```



