# Api Access Verify Request

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwQWNjZXNzJTI1MjBWZXJpZnklMjUyMFJlcXVlc3Q

The code to check, and which shop it's for.


# Interface Name

`ApiAccessVerifyRequest`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `shop` | `string` | Required | The shop's link name. |
| `code` | `string` | Required | The access code the buyer entered. Case and dashes don't matter. |


# Example

```ts
import { ApiAccessVerifyRequest } from 'one-thing-sdk';

const apiAccessVerifyRequest: ApiAccessVerifyRequest = {
  shop: 'raptorrush',
  code: 'K7QF-M2XP-9HTD',
};
```



