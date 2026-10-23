# Agent Delivery Access Code

Source: /#/http/x-redirect/JTI0bSUyRkFnZW50RGVsaXZlcnlBY2Nlc3NDb2Rl

A digital product unlocked with an access code.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `type` | `String` | Required, Constant | **Value**: `access_code` |
| `access_code` | `String` | Required | - |
| `start_url` | `String` | Optional | The seller's app with the code filled in. |


# Example (as JSON)

```json
{
  "type": "access_code",
  "access_code": "access_code2",
  "start_url": "start_url4"
}
```



