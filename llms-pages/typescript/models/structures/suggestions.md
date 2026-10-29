# Suggestions

Source: /#/typescript/x-redirect/JTI0bSUyRlN1Z2dlc3Rpb25z

What Gemini thinks buyers will want to choose or ask. The seller confirms; nothing is applied on its own.


# Interface Name

`Suggestions`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `oneOfAKind` | `boolean` | Required | A single item (vintage, handmade), so options and stock don't apply. |
| `options` | [`Option[]`](/llms-pages/typescript/models/structures/option.md) | Required | Options buyers will likely want to pick. |
| `missingFacts` | [`MissingFact[]`](/llms-pages/typescript/models/structures/missing-fact.md) | Required | Questions buyers will ask that the listing doesn't answer yet. |


# Example

```ts
import { Kind, Suggestions } from 'one-thing-sdk';

const suggestions: Suggestions = {
  oneOfAKind: false,
  options: [
    {
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
    }
  ],
  missingFacts: [
    {
      label: 'Size',
      question: 'What size are the skates?',
      placeholder: 'US women\'s 8',
    }
  ],
};
```



