# Shop Photos

Source: /#/typescript/x-redirect/JTI0bSUyRlNob3BQaG90b3M

The shop's photos.


# Interface Name

`ShopPhotos`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `photos` | [`Photo[]`](/llms-pages/typescript/models/structures/photo.md) | Required | Every photo, the cover first. |


# Example

```ts
import { ShopPhotos } from 'one-thing-sdk';

const shopPhotos: ShopPhotos = {
  photos: [
    {
      id: 'LFRvGuTU3D8i334X',
      url: '/api/blobs/LFRvGuTU3D8i334X',
    }
  ],
};
```



