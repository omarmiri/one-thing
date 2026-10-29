# Agent Delivery Access Code

Source: /#/http/x-redirect/JTI0bSUyRkFnZW50RGVsaXZlcnlBY2Nlc3NDb2Rl

A digital product unlocked with an access code.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `type` | `String` | Required, Constant | Always `access_code`.<br><br>**Value**: `access_code` |
| `access_code` | `String` | Required | The buyer's code, which unlocks the seller's app or game. |
| `start_url` | `String` | Optional | The seller's app with the code filled in. |


# Example (as JSON)

```json
{
  "type": "access_code",
  "access_code": "K7QF-M2XP-9HTD",
  "start_url": "https://www.miriogames.com/raptor-rush/?code=K7QF-M2XP-9HTD"
}
```



