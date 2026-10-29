# Missing Fact

Source: /#/typescript/x-redirect/JTI0bSUyRk1pc3NpbmdGYWN0

One question to answer.


# Interface Name

`MissingFact`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `label` | `string` | Required | The product detail it becomes. |
| `question` | `string` | Required | The question, for the seller. |
| `placeholder` | `string` | Required | An example answer. |


# Example

```ts
import { MissingFact } from 'one-thing-sdk';

const missingFact: MissingFact = {
  label: 'Size',
  question: 'What size are the skates?',
  placeholder: 'US women\'s 8',
};
```



