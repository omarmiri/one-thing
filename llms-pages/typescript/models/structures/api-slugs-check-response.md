# Api Slugs Check Response

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwU2x1Z3MlMjUyMENoZWNrJTI1MjBSZXNwb25zZQ


# Interface Name

`ApiSlugsCheckResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `string` | Required | - |
| `available` | `boolean` | Required | - |
| `problem` | `string \| undefined` | Optional | Why not, when unavailable. |


# Example

```ts
import { ApiSlugsCheckResponse } from 'one-thing-sdk';

const apiSlugsCheckResponse: ApiSlugsCheckResponse = {
  slug: 'slug8',
  available: false,
  problem: 'problem8',
};
```



