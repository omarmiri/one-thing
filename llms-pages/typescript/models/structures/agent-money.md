# Agent Money

Source: /#/typescript/x-redirect/JTI0bSUyRkFnZW50TW9uZXk

An amount of money, as a number and as a label.


# Interface Name

`AgentMoney`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `amount` | `number` | Required | The amount in the currency's main unit (dollars, not cents). |
| `currency` | `string` | Required | ISO 4217 currency code. |
| `label` | `string \| undefined` | Optional | The amount formatted for people. |


# Example

```ts
import { AgentMoney } from 'one-thing-sdk';

const agentMoney: AgentMoney = {
  amount: 240,
  currency: 'USD',
  label: '$240.00',
};
```



