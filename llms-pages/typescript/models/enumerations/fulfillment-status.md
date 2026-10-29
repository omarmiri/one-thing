# Fulfillment Status

Source: /#/typescript/x-redirect/JTI0bSUyRkZ1bGZpbGxtZW50U3RhdHVz

`to_ship` and `shipped` for physical orders, `digital_sent` for digital ones, `none` before payment.


# Enum Type Name

`FulfillmentStatus`


# Fields

| Name |
|  --- |
| `None` |
| `ToShip` |
| `Shipped` |
| `DigitalSent` |


# Example

```ts
import { FulfillmentStatus } from 'one-thing-sdk';

const fulfillmentStatus = FulfillmentStatus.Shipped;
```



