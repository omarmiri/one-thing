# Overview

Source: /#/typescript/x-redirect/JTI0aCUyRl9fV2ViaG9va3NfX3dlYmhvb2tzX19vdmVydmlldw


## Webhooks Handler



## Events

Events available in this group. Subscribe to receive webhook notifications when these events occur.

| Name | Description |
|  --- | --- |
| [orderEvent](/llms-pages/typescript/events/webhooks/order-event.md) | If a shop sets `zapier_hook_url` (a `https://hooks.zapier.com/` Catch Hook), every paid,<br>shipped and refunded order is POSTed to it. Best effort: a failing hook never affects the sale. |

# SDK Usage Example

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



