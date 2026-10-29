# Agent Money

Source: /#/python/x-redirect/JTI0bSUyRkFnZW50TW9uZXk

An amount of money, as a number and as a label.


# Class Name

`AgentMoney`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `amount` | `float` | Required | The amount in the currency's main unit (dollars, not cents). |
| `currency` | `str` | Required | ISO 4217 currency code. |
| `label` | `str` | Optional | The amount formatted for people. |


# Example

```python
from onethingapi.models.agent_money import AgentMoney

agent_money = AgentMoney(
    amount=240,
    currency='USD',
    label='$240.00'
)
```



