# Api Slugs Check Response

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwU2x1Z3MlMjUyMENoZWNrJTI1MjBSZXNwb25zZQ

Whether the link name can be used.


# Interface Name

`ApiSlugsCheckResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `string` | Required | The name, normalised. |
| `available` | `boolean` | Required | True if no other shop has it and it isn't reserved. |
| `problem` | `string \| undefined` | Optional | Why not, when unavailable. |


# Example

```ts
import { ApiSlugsCheckResponse } from 'one-thing-sdk';

const apiSlugsCheckResponse: ApiSlugsCheckResponse = {
  slug: 'vintageskates',
  available: true,
  problem: 'Taken. Try another name.',
};
```



