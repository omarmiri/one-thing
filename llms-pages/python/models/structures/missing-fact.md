# Missing Fact

Source: /#/python/x-redirect/JTI0bSUyRk1pc3NpbmdGYWN0

One question to answer.


# Class Name

`MissingFact`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `label` | `str` | Required | The product detail it becomes. |
| `question` | `str` | Required | The question, for the seller. |
| `placeholder` | `str` | Required | An example answer. |


# Example

```python
from onethingapi.models.missing_fact import MissingFact

missing_fact = MissingFact(
    label='Size',
    question='What size are the skates?',
    placeholder='US women\'s 8'
)
```



