# Shipping

Source: /#/typescript/x-redirect/JTI0bSUyRlNoaXBwaW5n


# Interface Name

`Shipping`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `amount` | `number` | Required | - |
| `currency` | `string` | Required | - |
| `shipsTo` | `string[]` | Required | Country codes; empty means anywhere PayPal ships. |


# Example

```ts
import { Shipping } from 'one-thing-sdk';

const shipping: Shipping = {
  amount: 113.16,
  currency: 'currency4',
  shipsTo: [
    'ships_to7',
    'ships_to8',
    'ships_to9'
  ],
};
```



