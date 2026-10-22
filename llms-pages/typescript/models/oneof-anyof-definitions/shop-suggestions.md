# Shop Suggestions

Source: /#/typescript/x-redirect/JTI0bSUyRlNob3BTdWdnZXN0aW9ucw


# Class Name

`ShopSuggestions`


# Cases

| Type |
|  --- |
| [`Suggestions`](/llms-pages/typescript/models/structures/suggestions.md) |


# Suggestions

## Initialization Code

### Example

```ts
const value: ShopSuggestions = {
  oneOfAKind: false,
  options: [
    {
      name: 'Size',
      kind: Kind.Size,
      values: [
        {
          label: 'M',
          hex: '#14171a',
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



