# Variant

Source: /#/typescript/x-redirect/JTI0bSUyRlZhcmlhbnQ


# Interface Name

`Variant`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `choice` | `Record<string, string>` | Required | The buyer's pick, one value per option, keyed by option name. |
| `availability` | `string` | Required | - |
| `orderUrl` | `string \| undefined` | Optional | `orderByLink` for this pick. Left out when it's sold out. |


# Example

```ts
import { Variant } from 'one-thing-sdk';

const variant: Variant = {
  choice: {
    'Size': 'M',
    'Color': 'Black'
  },
  availability: 'availability4',
  orderUrl: 'order_url0',
};
```



