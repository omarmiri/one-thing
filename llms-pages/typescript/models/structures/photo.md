# Photo

Source: /#/typescript/x-redirect/JTI0bSUyRlBob3Rv

One photo.


# Interface Name

`Photo`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `string` | Required | The photo's id, for `getImage`, `setPhotoOrder` and colour matching. |
| `url` | `string` | Required | Public image URL on this site. |


# Example

```ts
import { Photo } from 'one-thing-sdk';

const photo: Photo = {
  id: 'LFRvGuTU3D8i334X',
  url: '/api/blobs/LFRvGuTU3D8i334X',
};
```



