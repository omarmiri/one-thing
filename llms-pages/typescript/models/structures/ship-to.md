# Ship To

Source: /#/typescript/x-redirect/JTI0bSUyRlNoaXBUbw

Where it ships, from the buyer's PayPal checkout. Null if PayPal didn't share it.


# Interface Name

`ShipTo`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `name` | `string \| null \| undefined` | Optional | The recipient's name. |
| `address` | `string \| undefined` | Optional | The address on one line. |


# Example

```ts
import { ShipTo } from 'one-thing-sdk';

const shipTo: ShipTo = {
  name: 'Sam Rivera',
  address: '1 Main St, Springfield, IL, 62701, US',
};
```



