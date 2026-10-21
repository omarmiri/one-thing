# Order Event

Source: /#/typescript/x-redirect/JTI0aCUyRl9fV2ViaG9va3NfX3dlYmhvb2tzX29yZGVyZXZlbnQ


# Order Event

If a shop sets `zapier_hook_url` (a `https://hooks.zapier.com/` Catch Hook), every paid
and shipped order is POSTed to it. Best effort: a failing hook never affects the sale.

## Headers

This event's request contains the following headers.

| Name |
|  --- |
| Content-Type |

## Payload Type

This event's request payload is of type [OrderEvent | undefined](/llms-pages/typescript/models/structures/order-event.md).

## Payload Example

```json
{
  "event": "order.paid",
  "shop": {
    "slug": "slug4",
    "name": "name0",
    "url": "url4"
  },
  "order": {
    "amount": "2.99",
    "id": "id6",
    "paypal_order_id": "paypal_order_id6",
    "currency": "currency6",
    "buyer_name": "buyer_name4"
  }
}
```

## SDK Usage Example

```ts
import express, { Request, Response } from 'express';
import {
  convertExpressRequest,
  WebhooksHandler,
  WebhooksParsingResult,
} from 'one-thing-sdk';

const app = express();
app.use(express.json());

const handler = new WebhooksHandler();

app.post('/webhooks', (req: Request, res: Response) => {
  // Use the provided handler to parse the incoming event
  const result = handler.parseEvent(convertExpressRequest(req));

  if (WebhooksParsingResult.isOrderEventEvent(result)) {
    // Result narrowed down to type OrderEvent
    res.status(200).send(result);
  } else if (WebhooksParsingResult.isEventTypeUnknown(result)) {
    // Result narrowed down to type UnknownEvent
    res.status(400).send(result);
  }
});
```

## Accepted Server Responses

The server should responds with one of the following status codes:

| Status Code | Description |
|  --- | --- |
| 200 | Any 2xx. |



