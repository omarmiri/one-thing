# Order Event

Source: /#/typescript/x-redirect/JTI0bSUyRk9yZGVyRXZlbnQ

What OneThing posts to the seller's Zapier hook.


# Interface Name

`OrderEvent`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `event` | [`Event`](/llms-pages/typescript/models/enumerations/event.md) | Required | What happened. |
| `shop` | [`Shop1`](/llms-pages/typescript/models/structures/shop-1.md) | Required | The shop the order belongs to. |
| `order` | [`Order1`](/llms-pages/typescript/models/structures/order-1.md) | Required | The order. |


# Example

```ts
import { Event, OrderEvent } from 'one-thing-sdk';

const orderEvent: OrderEvent = {
  event: Event.EnumOrderpaid,
  shop: {
    slug: 'vintageskates',
    name: 'Vintage Cream and Red Roller Skates',
    url: 'https://one-thing-ash0.onrender.com/vintageskates',
  },
  order: {
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
  },
};
```



