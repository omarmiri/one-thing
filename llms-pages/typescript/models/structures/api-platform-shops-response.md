# Api Platform Shops Response

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwUGxhdGZvcm0lMjUyMFNob3BzJTI1MjBSZXNwb25zZQ

The account's shops.


# Interface Name

`ApiPlatformShopsResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `shops` | [`PlatformShop[]`](/llms-pages/typescript/models/structures/platform-shop.md) | Required | Shops, newest first. |


# Example

```ts
import {
  ApiPlatformShopsResponse,
  ProductType3,
  Status3,
} from 'one-thing-sdk';

const apiPlatformShopsResponse: ApiPlatformShopsResponse = {
  shops: [
    {
      slug: 'vintageskates',
      status: Status3.Draft,
      name: 'Vintage Cream and Red Roller Skates',
      productType: ProductType3.Physical,
      price: {
        amount: 240,
        currency: 'USD',
        label: '$240.00',
      },
      url: 'https://one-thing-ash0.onrender.com/vintageskates',
      paypalConnected: true,
      sales: 12,
      createdAt: '2026-10-22T02:41:37Z',
      headline: 'Classic quad skates crafted with walnut burl heels',
      cover: 'https://one-thing-ash0.onrender.com/api/blobs/LFRvGuTU3D8i334X',
    }
  ],
};
```



