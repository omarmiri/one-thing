# Shop Option

Source: /#/typescript/x-redirect/JTI0bSUyRlNob3BPcHRpb24

Something the buyer picks, such as a size or a colour. The shop still sells one product.


# Interface Name

`ShopOption`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `name` | `string` | Required | What the buyer is choosing.<br><br>**Constraints**: *Maximum Length*: `20` |
| `kind` | [`Kind`](/llms-pages/typescript/models/enumerations/kind.md) | Required | `color` shows swatches, and the photo of the picked colour. |
| `values` | [`OptionValue[]`](/llms-pages/typescript/models/structures/option-value.md) | Required | The values to pick from.<br><br>**Constraints**: *Minimum Items*: `1`, *Maximum Items*: `12` |


# Example

```ts
import { Kind, ShopOption } from 'one-thing-sdk';

const shopOption: ShopOption = {
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



