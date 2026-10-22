# Suggestions

Source: /#/python/x-redirect/JTI0bSUyRlN1Z2dlc3Rpb25z

What Gemini thinks buyers will want to choose or ask. The seller confirms; nothing is applied on its own.


# Class Name

`Suggestions`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `one_of_a_kind` | `bool` | Required | A single item (vintage, handmade), so options and stock don't apply. |
| `options` | [`List[Option]`](/llms-pages/python/models/structures/option.md) | Required | - |
| `missing_facts` | [`List[MissingFact]`](/llms-pages/python/models/structures/missing-fact.md) | Required | - |


# Example

```python
from onethingapi.models.kind import Kind
from onethingapi.models.missing_fact import MissingFact
from onethingapi.models.option import Option
from onethingapi.models.option_value import OptionValue
from onethingapi.models.suggestions import Suggestions

suggestions = Suggestions(
    one_of_a_kind=False,
    options=[
        Option(
            name='Size',
            kind=Kind.SIZE,
            values=[
                OptionValue(
                    label='M',
                    hex='#14171a',
                    photo='photo6'
                )
            ],
            from_seller=False
        )
    ],
    missing_facts=[
        MissingFact(
            label='Size',
            question='What size are the skates?',
            placeholder='US women\'s 8'
        )
    ]
)
```



