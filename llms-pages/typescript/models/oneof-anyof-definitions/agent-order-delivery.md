# Agent Order Delivery

Source: /#/typescript/x-redirect/JTI0bSUyRkFnZW50T3JkZXJEZWxpdmVyeQ


# Class Name

`AgentOrderDelivery`


# Cases

| Type |
|  --- |
| [`AgentDeliveryAccessCode`](/llms-pages/typescript/models/structures/agent-delivery-access-code.md) |
| [`AgentDeliveryDownload`](/llms-pages/typescript/models/structures/agent-delivery-download.md) |
| [`AgentDeliveryShipping`](/llms-pages/typescript/models/structures/agent-delivery-shipping.md) |


# AgentDeliveryAccessCode

## Initialization Code

### Example

```ts
const value: AgentOrderDelivery = {
  type: 'access_code',
  accessCode: 'K7QF-M2XP-9HTD',
  startUrl: 'https://www.miriogames.com/raptor-rush/?code=K7QF-M2XP-9HTD',
};
```


# AgentDeliveryDownload

## Initialization Code

### Example

```ts
const value: AgentOrderDelivery = {
  type: 'download',
  downloadUrl: 'https://one-thing-ash0.onrender.com/api/download/dl_4mQ8sT2vX9',
  note: 'Works 5 times over 14 days.',
};
```


# AgentDeliveryShipping

## Initialization Code

### Example

```ts
const value: AgentOrderDelivery = {
  type: 'shipping',
  fulfillment: Fulfillment.ToShip,
  shipTo: {
    name: 'Sam Rivera',
    address: '1 Main St, Springfield, IL, 62701, US',
  },
  tracking: {
    carrier: 'USPS',
    number: '9400111899223197428490',
  },
};
```



