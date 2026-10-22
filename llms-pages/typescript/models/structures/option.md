# Option

Source: /#/typescript/x-redirect/JTI0bSUyRk9wdGlvbg


# Interface Name

`Option`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `name` | `string` | Required | **Constraints**: *Maximum Length*: `20` |
| `kind` | [`Kind`](/llms-pages/typescript/models/enumerations/kind.md) | Required | `color` shows swatches, and the photo of the picked colour. |
| `values` | [`OptionValue[]`](/llms-pages/typescript/models/structures/option-value.md) | Required | **Constraints**: *Minimum Items*: `1`, *Maximum Items*: `12` |
| `fromSeller` | `boolean \| undefined` | Optional | The seller's description or photo named these values; otherwise they're a guess. |


# Example

```ts
import { Kind, Option } from 'one-thing-sdk';

const option: Option = {
  name: 'Size',
  kind: Kind.Color,
  values: [
    {
      label: 'M',
      hex: '#14171a',
      photo: 'photo6',
    }
  ],
  fromSeller: false,
};
```



