# Fact

Source: /#/typescript/x-redirect/JTI0bSUyRkZhY3Q

One answered question.


# Interface Name

`Fact`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `label` | `string` | Required | The detail's label.<br><br>**Constraints**: *Maximum Length*: `30` |
| `value` | `string` | Required | The answer.<br><br>**Constraints**: *Maximum Length*: `100` |


# Example

```ts
import { Fact } from 'one-thing-sdk';

const fact: Fact = {
  label: 'Size',
  value: 'US women\'s 8',
};
```



