# Option Value

Source: /#/typescript/x-redirect/JTI0bSUyRk9wdGlvblZhbHVl

One value of an option.


# Interface Name

`OptionValue`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `label` | `string` | Required | What the buyer sees and picks.<br><br>**Constraints**: *Maximum Length*: `30` |
| `hex` | `string \| undefined` | Optional | A colour as `#rrggbb`.<br><br>**Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |
| `photo` | `string \| undefined` | Optional | Colours: the shop photo (id) that shows this colour. See `matchColorPhotos`. |


# Example

```ts
import { OptionValue } from 'one-thing-sdk';

const optionValue: OptionValue = {
  label: 'M',
  hex: '#14171a',
  photo: 'zrySajNyao6_j11x',
};
```



