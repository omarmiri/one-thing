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
  accessCode: 'access_code2',
};
```


# AgentDeliveryDownload

## Initialization Code

### Example

```ts
const value: AgentOrderDelivery = {
  type: 'download',
  downloadUrl: 'download_url8',
};
```


# AgentDeliveryShipping

## Initialization Code

### Example

```ts
const value: AgentOrderDelivery = {
  type: 'shipping',
  fulfillment: Fulfillment.ToShip,
};
```



