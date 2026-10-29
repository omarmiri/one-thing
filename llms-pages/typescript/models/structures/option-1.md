# Option 1

Source: /#/typescript/x-redirect/JTI0bSUyRk9wdGlvbjE

One option and its values.


# Interface Name

`Option1`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `name` | `string` | Required | The option's name, which is also its query parameter on `order_url`. |
| `values` | `string[]` | Required | The values the buyer can pick. |


# Example

```ts
import { Option1 } from 'one-thing-sdk';

const option1: Option1 = {
  name: 'Size',
  values: [
    '7',
    '8',
    '9'
  ],
};
```



