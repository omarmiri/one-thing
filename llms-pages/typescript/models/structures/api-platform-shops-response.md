# Api Platform Shops Response

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwUGxhdGZvcm0lMjUyMFNob3BzJTI1MjBSZXNwb25zZQ


# Interface Name

`ApiPlatformShopsResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `shops` | [`PlatformShop[]`](/llms-pages/typescript/models/structures/platform-shop.md) | Required | - |


# Example

```ts
import {
  ApiPlatformShopsResponse,
  ProductType1,
  Status,
} from 'one-thing-sdk';

const apiPlatformShopsResponse: ApiPlatformShopsResponse = {
  shops: [
    {
      slug: 'slug6',
      status: Status.Draft,
      name: 'name0',
      productType: ProductType1.Digital,
      price: {
        amount: 48.5,
        currency: 'USD',
        label: '$48.50',
      },
      url: 'url4',
      paypalConnected: false,
      sales: 28,
      createdAt: '2016-03-13T12:52:32.123Z',
      headline: 'headline0',
      cover: 'cover6',
    }
  ],
};
```



