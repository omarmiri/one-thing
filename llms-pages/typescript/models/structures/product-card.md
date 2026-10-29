# Product Card

Source: /#/typescript/x-redirect/JTI0bSUyRlByb2R1Y3RDYXJk

A Channel3 product in search results.


# Interface Name

`ProductCard`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `string` | Required | Channel3's product id: pass it to `createShop` as `productId`. |
| `title` | `string` | Required | The product's name. |
| `brand` | `string \| null \| undefined` | Optional | The brand, when known. |
| `image` | `string` | Required | The product image's URL. |
| `price` | `number` | Required | The best offer's price. |
| `currency` | `string` | Required | ISO 4217 currency code. |
| `retailer` | `string` | Required | The store with the best offer. |
| `retailers` | `number` | Required | How many stores sell it. |
| `commission` | `number` | Required | Best commission rate across offers, 0–1. |


# Example

```ts
import { ProductCard } from 'one-thing-sdk';

const productCard: ProductCard = {
  id: 'ch3_7f2a9c1e',
  title: 'Trail Running Vest 5L',
  image: 'https://images.example.com/vest.jpg',
  price: 240,
  currency: 'USD',
  retailer: 'rei.com',
  retailers: 4,
  commission: 0.08,
  brand: 'Salomon',
};
```



