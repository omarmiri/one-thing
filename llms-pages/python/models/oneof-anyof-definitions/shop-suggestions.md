# Shop Suggestions

Source: /#/python/x-redirect/JTI0bSUyRlNob3BTdWdnZXN0aW9ucw


# Data Type

`Suggestions`


# Cases

| Type |
|  --- |
| [`Suggestions`](/llms-pages/python/models/structures/suggestions.md) |


# Suggestions

## Initialization Code

### Example

```python
value = Suggestions(
    one_of_a_kind=False,
    options=[
        Option(
            name='Size',
            kind=Kind.SIZE,
            values=[
                OptionValue(
                    label='M',
                    hex='#14171a'
                )
            ]
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



