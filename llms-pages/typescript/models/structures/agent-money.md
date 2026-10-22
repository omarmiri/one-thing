# Agent Money

Source: /#/typescript/x-redirect/JTI0bSUyRkFnZW50TW9uZXk


# Interface Name

`AgentMoney`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `amount` | `number` | Required | - |
| `currency` | `string` | Required | - |
| `label` | `string \| undefined` | Optional | - |


# Example

```ts
import { AgentMoney } from 'one-thing-sdk';

const agentMoney: AgentMoney = {
  amount: 48.5,
  currency: 'USD',
  label: '$48.50',
};
```



