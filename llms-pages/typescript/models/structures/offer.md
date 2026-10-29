# Offer

Source: /#/typescript/x-redirect/JTI0bSUyRk9mZmVy

One store's offer.


# Interface Name

`Offer`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `domain` | `string` | Required | The store's domain. |
| `url` | `string` | Required | A Channel3-tracked buy link, credited to this shop. |
| `price` | `number` | Required | The store's price. |
| `currency` | `string` | Required | ISO 4217 currency code. |
| `inStock` | `boolean` | Required | Whether the store has it in stock. |
| `commission` | `number` | Required | Maximum commission rate, 0–1 (0.08 = 8%). |


# Example

```ts
import { Offer } from 'one-thing-sdk';

const offer: Offer = {
  domain: 'rei.com',
  url: 'https://buy.trychannel3.com/r/abc123',
  price: 240,
  currency: 'USD',
  inStock: true,
  commission: 0.08,
};
```



