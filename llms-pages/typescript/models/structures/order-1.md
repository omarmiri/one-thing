# Order 1

Source: /#/typescript/x-redirect/JTI0bSUyRk9yZGVyMQ

The order.


# Interface Name

`Order1`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `string \| undefined` | Optional | OneThing's order id. |
| `paypalOrderId` | `string \| null \| undefined` | Optional | PayPal's order id. |
| `amount` | `string \| undefined` | Optional | The total, as a decimal string. |
| `currency` | `string \| undefined` | Optional | ISO 4217 currency code. |
| `buyerName` | `string \| null \| undefined` | Optional | The buyer's name, from PayPal. |
| `buyerEmail` | `string \| null \| undefined` | Optional | The buyer's email, from PayPal. |
| `shippingAddress` | `unknown \| null \| undefined` | Optional | Physical orders: the address, by field. |
| `fulfillmentStatus` | `string \| undefined` | Optional | As in `Order.fulfillment_status`. |
| `trackingNumber` | `string \| null \| undefined` | Optional | The tracking number, once shipped. |
| `carrier` | `string \| null \| undefined` | Optional | The carrier, once shipped. |


# Example

```ts
import { Order1 } from 'one-thing-sdk';

const order1: Order1 = {
  id: 'pX4kR9tVb2nQ7sLe',
  paypalOrderId: '5O190127TN364715T',
  amount: '255.00',
  currency: 'USD',
  buyerName: 'Sam Rivera',
  buyerEmail: 'sam@example.com',
  shippingAddress: { 'address_line_1': '1 Main St', 'admin_area_2': 'Springfield', 'admin_area_1': 'IL', 'postal_code': '62701', 'country_code': 'US' },
  fulfillmentStatus: 'to_ship',
  trackingNumber: '9400111899223197428490',
  carrier: 'USPS',
};
```



