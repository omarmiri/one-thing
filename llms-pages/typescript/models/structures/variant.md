# Variant

Source: /#/typescript/x-redirect/JTI0bSUyRlZhcmlhbnQ

One combination of option values.


# Interface Name

`Variant`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `choice` | `Record<string, string>` | Required | The buyer's pick, one value per option, keyed by option name. |
| `availability` | `string` | Required | `in_stock`, `in_stock (N left)` or `sold_out`. |
| `orderUrl` | `string \| undefined` | Optional | `orderByLink` for this pick. Left out when it's sold out. |


# Example

```ts
import { Variant } from 'one-thing-sdk';

const variant: Variant = {
  choice: {
    'Size': 'M',
    'Color': 'Black'
  },
  availability: 'in_stock (3 left)',
  orderUrl: 'https://one-thing-ash0.onrender.com/vintageskates/buy?Size=9',
};
```



