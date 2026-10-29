# Order Event

Source: /#/typescript/x-redirect/JTI0bSUyRk9yZGVyRXZlbnQ


# Interface Name

`OrderEvent`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `event` | [`Event`](/llms-pages/typescript/models/enumerations/event.md) | Required | - |
| `shop` | [`Shop1`](/llms-pages/typescript/models/structures/shop-1.md) | Required | - |
| `order` | [`Order1`](/llms-pages/typescript/models/structures/order-1.md) | Required | - |


# Example

```ts
import { Event, OrderEvent } from 'one-thing-sdk';

const orderEvent: OrderEvent = {
  event: Event.EnumOrdershipped,
  shop: {
    slug: 'slug4',
    name: 'name0',
    url: 'url4',
  },
  order: {
    id: 'id6',
    paypalOrderId: 'paypal_order_id6',
    amount: '2.99',
    currency: 'currency6',
    buyerName: 'buyer_name4',
  },
};
```



