# Order Event

Source: /#/typescript/x-redirect/JTI0aCUyRl9fV2ViaG9va3NfX3dlYmhvb2tzX29yZGVyZXZlbnQ


# Order Event

If a shop sets `zapier_hook_url` (a `https://hooks.zapier.com/` Catch Hook), every paid,
shipped and refunded order is POSTed to it. Best effort: a failing hook never affects the sale.

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
    "slug": "vintageskates",
    "name": "Vintage Cream and Red Roller Skates",
    "url": "https://one-thing-ash0.onrender.com/vintageskates"
  },
  "order": {
    "id": "pX4kR9tVb2nQ7sLe",
    "paypal_order_id": "5O190127TN364715T",
    "amount": "255.00",
    "currency": "USD",
    "buyer_name": "Sam Rivera",
    "buyer_email": "buyer@example.com",
    "shipping_address": {
      "address_line_1": "1 Main St",
      "admin_area_2": "Springfield",
      "admin_area_1": "IL",
      "postal_code": "62701",
      "country_code": "US"
    },
    "fulfillment_status": "to_ship",
    "tracking_number": null,
    "carrier": null
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



