# Order Event

Source: /#/python/x-redirect/JTI0aCUyRl9fV2ViaG9va3NfX3dlYmhvb2tzX29yZGVyZXZlbnQ


# Order Event

If a shop sets `zapier_hook_url` (a `https://hooks.zapier.com/` Catch Hook), every paid,
shipped and refunded order is POSTed to it. Best effort: a failing hook never affects the sale.

## Headers

This event's request contains the following headers.

| Name |
|  --- |
| Content-Type |

## Payload Type

This event's request payload is of type [OrderEvent](/llms-pages/python/models/structures/order-event.md).

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

```python
from flask import (
    Flask,
    Response,
    request,
)

from onethingapi.events.unknown_event import (
    UnknownEvent,
)
from onethingapi.events.webhooks.webhooks_handler import (
    WebhooksHandler,
)
from onethingapi.models.order_event import OrderEvent
from onethingapi.utilities.request_adapter import (
    to_core_request,
)

app = Flask(__name__)

@app.route("/webhooks", methods=[
    "POST",
])
def Webhooks() -> Response:
    # Step 1: Convert the incoming request using to_core_request (Django/Flask)
    #         or await to_core_request_async (FastAPI).
    core_req = to_core_request(request)

    # Step 2: Parse the request into a typed event.
    event = WebhooksHandler.parse_event(core_req)

    # Step 3: Pattern match for orderEvent only.
    if isinstance(event, OrderEvent):
        print("orderEvent received")
        # TODO: add handling logic
    elif isinstance(event, UnknownEvent):
        print("Unknown event")
        # TODO: add unknown event handling

    # Step 4: Return 200 OK to acknowledge receipt (adjust with other codes if needed).
    return Response(status=200)
```

## Accepted Server Responses

The server should responds with one of the following status codes:

| Status Code | Description |
|  --- | --- |
| 200 | Any 2xx. |



