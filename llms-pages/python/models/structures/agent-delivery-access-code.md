# Agent Delivery Access Code

Source: /#/python/x-redirect/JTI0bSUyRkFnZW50RGVsaXZlcnlBY2Nlc3NDb2Rl

A digital product unlocked with an access code.


# Class Name

`AgentDeliveryAccessCode`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `mtype` | `str` | Required, Constant | Always `access_code`.<br><br>**Value**: `"access_code"` |
| `access_code` | `str` | Required | The buyer's code, which unlocks the seller's app or game. |
| `start_url` | `str` | Optional | The seller's app with the code filled in. |


# Example

```python
from onethingapi.models.agent_delivery_access_code import AgentDeliveryAccessCode

agent_delivery_access_code = AgentDeliveryAccessCode(
    access_code='K7QF-M2XP-9HTD',
    start_url='https://www.miriogames.com/raptor-rush/?code=K7QF-M2XP-9HTD'
)
```



