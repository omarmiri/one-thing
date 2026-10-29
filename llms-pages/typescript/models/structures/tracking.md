# Tracking

Source: /#/typescript/x-redirect/JTI0bSUyRlRyYWNraW5n

The carrier and tracking number once shipped; null before.


# Interface Name

`Tracking`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `carrier` | `string \| undefined` | Optional | The shipping carrier. |
| `number` | `string \| undefined` | Optional | The tracking number. |


# Example

```ts
import { Tracking } from 'one-thing-sdk';

const tracking: Tracking = {
  carrier: 'USPS',
  number: '9400111899223197428490',
};
```



