# Api Channel 3 Search Response

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwQ2hhbm5lbDMlMjUyMFNlYXJjaCUyNTIwUmVzcG9uc2U


# Interface Name

`ApiChannel3SearchResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `products` | [`ProductCard[]`](/llms-pages/typescript/models/structures/product-card.md) | Required | - |


# Example

```ts
import { ApiChannel3SearchResponse } from 'one-thing-sdk';

const apiChannel3SearchResponse: ApiChannel3SearchResponse = {
  products: [
    {
      id: 'id2',
      title: 'title2',
      image: 'image4',
      price: 194.6,
      currency: 'currency8',
      retailer: 'retailer8',
      retailers: 28,
      commission: 62.94,
      brand: 'brand6',
    }
  ],
};
```



