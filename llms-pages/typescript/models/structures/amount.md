# Amount

Source: /#/typescript/x-redirect/JTI0bSUyRkFtb3VudA

What the order costs, as numbers.


# Interface Name

`Amount`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `item` | `number` | Required | The product's price. |
| `shipping` | `number` | Required | Shipping; 0 for digital products. |
| `total` | `number` | Required | Product plus shipping: what the buyer pays. |
| `currency` | `string` | Required | ISO 4217 currency code. |


# Example

```ts
import { Amount } from 'one-thing-sdk';

const amount: Amount = {
  item: 240,
  shipping: 15,
  total: 255,
  currency: 'USD',
};
```



