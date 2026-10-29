# Offer 1

Source: /#/typescript/x-redirect/JTI0bSUyRk9mZmVyMQ

One store's offer.


# Interface Name

`Offer1`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `retailer` | `string` | Required | The store. |
| `price` | `number` | Required | The store's price. |
| `currency` | `string` | Required | ISO 4217 currency code. |
| `inStock` | `boolean` | Required | Whether the store has it in stock. |
| `url` | `string` | Required | A tracked buy link at that store. |


# Example

```ts
import { Offer1 } from 'one-thing-sdk';

const offer1: Offer1 = {
  retailer: 'rei.com',
  price: 240,
  currency: 'USD',
  inStock: true,
  url: 'https://buy.trychannel3.com/r/abc123',
};
```



