# Api Shops Photos Request

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyMFBob3RvcyUyNTIwUmVxdWVzdA

The new photo order.


# Interface Name

`ApiShopsPhotosRequest`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `photos` | `string[]` | Required | Photo ids, in order.<br><br>**Constraints**: *Maximum Items*: `8` |


# Example

```ts
import { ApiShopsPhotosRequest } from 'one-thing-sdk';

const apiShopsPhotosRequest: ApiShopsPhotosRequest = {
  photos: [
    'zrySajNyao6_j11x',
    'LFRvGuTU3D8i334X'
  ],
};
```



