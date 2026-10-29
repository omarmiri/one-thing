# Shop Option

Source: /#/http/x-redirect/JTI0bSUyRlNob3BPcHRpb24

Something the buyer picks, such as a size or a colour. The shop still sells one product.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `name` | `String` | Required | What the buyer is choosing.<br><br>**Constraints**: *Maximum Length*: `20` |
| `kind` | [`Kind`](/llms-pages/http/models/enumerations/kind.md) | Required | `color` shows swatches, and the photo of the picked colour. |
| `values` | [`array<Option Value>`](/llms-pages/http/models/structures/option-value.md) | Required | The values to pick from.<br><br>**Constraints**: *Minimum Items*: `1`, *Maximum Items*: `12` |


# Example (as JSON)

```json
{
  "name": "Size",
  "kind": "size",
  "values": [
    {
      "label": "S"
    },
    {
      "label": "M"
    },
    {
      "label": "L"
    }
  ]
}
```



