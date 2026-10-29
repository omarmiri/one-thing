# Created Shop

Source: /#/typescript/x-redirect/JTI0bSUyRkNyZWF0ZWRTaG9w

The new draft shop and the credentials to manage it.


# Interface Name

`CreatedShop`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `string` | Required | The shop's link name: the page is `https://<host>/<slug>`. |
| `token` | `string` | Required | The admin token. Shown once; store it. |
| `manageUrl` | `string` | Required | The seller's private manage page (contains the token). |


# Example

```ts
import { CreatedShop } from 'one-thing-sdk';

const createdShop: CreatedShop = {
  slug: 'dragonflight',
  token: '3fJ9xQm2LwP8vR1tZk7cN4bY6dHs0aEu',
  manageUrl: '/manage/vintageskates?token=3fJ9xQm2LwP8vR1tZk7cN4bY6dHs0aEu',
};
```



