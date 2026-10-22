# Missing Fact

Source: /#/python/x-redirect/JTI0bSUyRk1pc3NpbmdGYWN0


# Class Name

`MissingFact`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `label` | `str` | Required | - |
| `question` | `str` | Required | - |
| `placeholder` | `str` | Required | - |


# Example

```python
from onethingapi.models.missing_fact import MissingFact

missing_fact = MissingFact(
    label='Size',
    question='What size are the skates?',
    placeholder='US women\'s 8'
)
```



