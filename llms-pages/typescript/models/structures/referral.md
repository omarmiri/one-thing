# Referral

Source: /#/typescript/x-redirect/JTI0bSUyRlJlZmVycmFs

A recommended Channel3 product. Buy links are Channel3-tracked, credited to this shop.


# Interface Name

`Referral`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `productId` | `string` | Required | - |
| `title` | `string` | Required | - |
| `brand` | `string \| null \| undefined` | Optional | - |
| `image` | `string \| null \| undefined` | Optional | - |
| `offers` | [`Offer[]`](/llms-pages/typescript/models/structures/offer.md) | Required | - |


# Example

```ts
import { Referral } from 'one-thing-sdk';

const referral: Referral = {
  productId: 'productId6',
  title: 'title8',
  offers: [
    {
      domain: 'domain0',
      url: 'url8',
      price: 134.28,
      currency: 'currency4',
      inStock: false,
      commission: 2.62,
    }
  ],
  brand: 'brand6',
  image: 'image4',
};
```



