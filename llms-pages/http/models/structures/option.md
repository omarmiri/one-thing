# Option

Source: /#/http/x-redirect/JTI0bSUyRk9wdGlvbg

A suggested option.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `name` | `String` | Required | What the buyer is choosing.<br><br>**Constraints**: *Maximum Length*: `20` |
| `kind` | [`Kind`](/llms-pages/http/models/enumerations/kind.md) | Required | `color` shows swatches, and the photo of the picked colour. |
| `values` | [`array<Option Value>`](/llms-pages/http/models/structures/option-value.md) | Required | The values to pick from.<br><br>**Constraints**: *Minimum Items*: `1`, *Maximum Items*: `12` |
| `fromSeller` | `Boolean` | Optional | The seller's description or photo named these values; otherwise they're a guess. |


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



