# Product Card

Source: /#/typescript/x-redirect/JTI0bSUyRlByb2R1Y3RDYXJk


# Interface Name

`ProductCard`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `string` | Required | - |
| `title` | `string` | Required | - |
| `brand` | `string \| null \| undefined` | Optional | - |
| `image` | `string` | Required | - |
| `price` | `number` | Required | - |
| `currency` | `string` | Required | - |
| `retailer` | `string` | Required | The store with the best offer. |
| `retailers` | `number` | Required | - |
| `commission` | `number` | Required | Best commission rate across offers, 0–1. |


# Example

```ts
import { ProductCard } from 'one-thing-sdk';

const productCard: ProductCard = {
  id: 'id4',
  title: 'title0',
  image: 'image2',
  price: 224.18,
  currency: 'currency4',
  retailer: 'retailer6',
  retailers: 142,
  commission: 92.52,
  brand: 'brand8',
};
```



