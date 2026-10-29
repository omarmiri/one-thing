# Referral

Source: /#/typescript/x-redirect/JTI0bSUyRlJlZmVycmFs

A recommended Channel3 product. Buy links are Channel3-tracked, credited to this shop.


# Interface Name

`Referral`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `productId` | `string` | Required | Channel3's product id. |
| `title` | `string` | Required | The product's name. |
| `brand` | `string \| null \| undefined` | Optional | The brand, when known. |
| `image` | `string \| null \| undefined` | Optional | The product image's URL. |
| `offers` | [`Offer[]`](/llms-pages/typescript/models/structures/offer.md) | Required | Stores that sell it, with tracked links. |


# Example

```ts
import { Referral } from 'one-thing-sdk';

const referral: Referral = {
  productId: 'ch3_7f2a9c1e',
  title: 'Trail Running Vest 5L',
  offers: [
    {
      domain: 'rei.com',
      url: 'https://buy.trychannel3.com/r/abc123',
      price: 240,
      currency: 'USD',
      inStock: true,
      commission: 0.08,
    }
  ],
  brand: 'Salomon',
  image: 'https://images.example.com/vest.jpg',
};
```



