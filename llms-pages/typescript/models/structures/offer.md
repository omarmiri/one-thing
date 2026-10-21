# Offer

Source: /#/typescript/x-redirect/JTI0bSUyRk9mZmVy


# Interface Name

`Offer`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `domain` | `string` | Required | - |
| `url` | `string` | Required | - |
| `price` | `number` | Required | - |
| `currency` | `string` | Required | - |
| `inStock` | `boolean` | Required | - |
| `commission` | `number` | Required | Maximum commission rate, 0–1 (0.08 = 8%). |


# Example

```ts
import { Offer } from 'one-thing-sdk';

const offer: Offer = {
  domain: 'domain0',
  url: 'url8',
  price: 136.68,
  currency: 'currency6',
  inStock: false,
  commission: 5.02,
};
```



