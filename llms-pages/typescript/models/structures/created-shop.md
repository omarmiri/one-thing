# Created Shop

Source: /#/typescript/x-redirect/JTI0bSUyRkNyZWF0ZWRTaG9w


# Interface Name

`CreatedShop`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `string` | Required | - |
| `token` | `string` | Required | The admin token. Shown once; store it. |
| `manageUrl` | `string` | Required | The seller's private manage page (contains the token). |


# Example

```ts
import { CreatedShop } from 'one-thing-sdk';

const createdShop: CreatedShop = {
  slug: 'dragonflight',
  token: 'token8',
  manageUrl: 'manageUrl0',
};
```



