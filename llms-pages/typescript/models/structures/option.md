# Option

Source: /#/typescript/x-redirect/JTI0bSUyRk9wdGlvbg

A suggested option.


# Interface Name

`Option`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `name` | `string` | Required | What the buyer is choosing.<br><br>**Constraints**: *Maximum Length*: `20` |
| `kind` | [`Kind`](/llms-pages/typescript/models/enumerations/kind.md) | Required | `color` shows swatches, and the photo of the picked colour. |
| `values` | [`OptionValue[]`](/llms-pages/typescript/models/structures/option-value.md) | Required | The values to pick from.<br><br>**Constraints**: *Minimum Items*: `1`, *Maximum Items*: `12` |
| `fromSeller` | `boolean \| undefined` | Optional | The seller's description or photo named these values; otherwise they're a guess. |


# Example

```ts
import { Kind, Option } from 'one-thing-sdk';

const option: Option = {
  name: 'Size',
  kind: Kind.Size,
  values: [
    {
      label: 'S',
    },
    {
      label: 'M',
    },
    {
      label: 'L',
    }
  ],
};
```



