# Suggestions

Source: /#/http/x-redirect/JTI0bSUyRlN1Z2dlc3Rpb25z

What Gemini thinks buyers will want to choose or ask. The seller confirms; nothing is applied on its own.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `oneOfAKind` | `Boolean` | Required | A single item (vintage, handmade), so options and stock don't apply. |
| `options` | [`array<Option>`](/llms-pages/http/models/structures/option.md) | Required | - |
| `missingFacts` | [`array<Missing Fact>`](/llms-pages/http/models/structures/missing-fact.md) | Required | - |


# Example (as JSON)

```json
{
  "oneOfAKind": false,
  "options": [
    {
      "name": "Size",
      "kind": "size",
      "values": [
        {
          "label": "M",
          "hex": "#14171a",
          "photo": "photo6"
        }
      ],
      "fromSeller": false
    }
  ],
  "missingFacts": [
    {
      "label": "Size",
      "question": "What size are the skates?",
      "placeholder": "US women's 8"
    }
  ]
}
```



