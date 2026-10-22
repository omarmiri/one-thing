# Api Shops Color Photos Request

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyMENvbG9yJTI1MjBQaG90b3MlMjUyMFJlcXVlc3Q


# Interface Name

`ApiShopsColorPhotosRequest`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `photos` | `Record<string, string \| null>` | Required | Colour label → photo id, or `null`. |


# Example

```ts
import { ApiShopsColorPhotosRequest } from 'one-thing-sdk';

const apiShopsColorPhotosRequest: ApiShopsColorPhotosRequest = {
  photos: {
    'key0': 'photos0'
  },
};
```



