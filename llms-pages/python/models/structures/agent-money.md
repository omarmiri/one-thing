# Agent Money

Source: /#/python/x-redirect/JTI0bSUyRkFnZW50TW9uZXk


# Class Name

`AgentMoney`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `amount` | `float` | Required | - |
| `currency` | `str` | Required | - |
| `label` | `str` | Optional | - |


# Example

```python
from onethingapi.models.agent_money import AgentMoney

agent_money = AgentMoney(
    amount=48.5,
    currency='USD',
    label='$48.50'
)
```



