# Fact

Source: /#/typescript/x-redirect/JTI0bSUyRkZhY3Q


# Interface Name

`Fact`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `label` | `string` | Required | **Constraints**: *Maximum Length*: `30` |
| `value` | `string` | Required | **Constraints**: *Maximum Length*: `100` |


# Example

```ts
import { Fact } from 'one-thing-sdk';

const fact: Fact = {
  label: 'Size',
  value: 'US women\'s 8',
};
```



