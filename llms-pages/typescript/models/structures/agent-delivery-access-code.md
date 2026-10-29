# Agent Delivery Access Code

Source: /#/typescript/x-redirect/JTI0bSUyRkFnZW50RGVsaXZlcnlBY2Nlc3NDb2Rl

A digital product unlocked with an access code.


# Interface Name

`AgentDeliveryAccessCode`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `type` | `string` | Required, Constant | Always `access_code`.<br><br>**Value**: `'access_code'` |
| `accessCode` | `string` | Required | The buyer's code, which unlocks the seller's app or game. |
| `startUrl` | `string \| undefined` | Optional | The seller's app with the code filled in. |


# Example

```ts
import { AgentDeliveryAccessCode } from 'one-thing-sdk';

const agentDeliveryAccessCode: AgentDeliveryAccessCode = {
  type: 'access_code',
  accessCode: 'K7QF-M2XP-9HTD',
  startUrl: 'https://www.miriogames.com/raptor-rush/?code=K7QF-M2XP-9HTD',
};
```



