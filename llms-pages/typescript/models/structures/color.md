# Color

Source: /#/typescript/x-redirect/JTI0bSUyRkNvbG9y


# Interface Name

`Color`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `label` | `string` | Required | **Constraints**: *Maximum Length*: `30` |
| `hex` | `string \| undefined` | Optional | **Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |


# Example

```ts
import { Color } from 'one-thing-sdk';

const color: Color = {
  label: 'Forest green',
  hex: '#14171a',
};
```



