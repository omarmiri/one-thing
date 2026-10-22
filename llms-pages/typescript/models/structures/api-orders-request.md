# Api Orders Request

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwT3JkZXJzJTI1MjBSZXF1ZXN0


# Interface Name

`ApiOrdersRequest`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `string` | Required | - |
| `options` | `Record<string, string> \| undefined` | Optional | The buyer's pick, one value per option, keyed by option name. |


# Example

```ts
import { ApiOrdersRequest } from 'one-thing-sdk';

const apiOrdersRequest: ApiOrdersRequest = {
  slug: 'slug4',
  options: {
    'Size': 'M',
    'Color': 'Black'
  },
};
```



