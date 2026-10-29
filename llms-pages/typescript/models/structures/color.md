# Color

Source: /#/typescript/x-redirect/JTI0bSUyRkNvbG9y

One colour.


# Interface Name

`Color`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `label` | `string` | Required | The colour's name, as buyers see it.<br><br>**Constraints**: *Maximum Length*: `30` |
| `hex` | `string \| undefined` | Optional | A colour as `#rrggbb`.<br><br>**Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |


# Example

```ts
import { Color } from 'one-thing-sdk';

const color: Color = {
  label: 'Ice Blue',
  hex: '#9fd3e6',
};
```



