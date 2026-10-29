# Api Shops Response

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyMFJlc3BvbnNl

The shop was saved.


# Interface Name

`ApiShopsResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `ok` | `boolean` | Required | Always `true`. |
| `slug` | `string` | Required | The shop's link name after this change. |


# Example

```ts
import { ApiShopsResponse } from 'one-thing-sdk';

const apiShopsResponse: ApiShopsResponse = {
  ok: true,
  slug: 'vintageskates',
};
```



