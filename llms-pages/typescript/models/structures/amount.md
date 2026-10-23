# Amount

Source: /#/typescript/x-redirect/JTI0bSUyRkFtb3VudA


# Interface Name

`Amount`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `item` | `number` | Required | - |
| `shipping` | `number` | Required | - |
| `total` | `number` | Required | - |
| `currency` | `string` | Required | - |


# Example

```ts
import { Amount } from 'one-thing-sdk';

const amount: Amount = {
  item: 175.9,
  shipping: 226.72,
  total: 71.32,
  currency: 'currency2',
};
```



