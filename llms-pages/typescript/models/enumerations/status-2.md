# Status 2

Source: /#/typescript/x-redirect/JTI0bSUyRlN0YXR1czI

`declined`: PayPal declined it, nothing charged, the buyer can open `pay_url` again. `sold_out`: it sold out before the payment was captured. `expired`: the PayPal checkout expired; create a new order. `failed`: PayPal couldn't be reached; ask again.


# Enum Type Name

`Status2`


# Fields

| Name |
|  --- |
| `AwaitingBuyerApproval` |
| `Paid` |
| `Declined` |
| `SoldOut` |
| `Expired` |
| `Failed` |


# Example

```ts
import { Status2 } from 'one-thing-sdk';

const status2 = Status2.Declined;
```



