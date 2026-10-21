# Overview

Source: /#/python/x-redirect/JTI0aCUyRl9fV2ViaG9va3NfX3dlYmhvb2tzX19vdmVydmlldw


## Webhooks Handler



## Events

Events available in this group. Subscribe to receive webhook notifications when these events occur.

| Name | Description |
|  --- | --- |
| [orderEvent](/llms-pages/python/events/webhooks/order-event.md) | If a shop sets `zapier_hook_url` (a `https://hooks.zapier.com/` Catch Hook), every paid<br>and shipped order is POSTed to it. Best effort: a failing hook never affects the sale. |

# SDK Usage Example

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
def Webhooks():
    # Step 1: Convert the incoming request using to_core_request (Django/Flask)
    #         or await to_core_request_async (FastAPI).
    core_req = to_core_request(request)

    # Step 2: Parse the request into a typed event.
    event = WebhooksHandler.parse_event(core_req)

    # Step 3: Pattern match on the event type and handle it.
    if isinstance(event, OrderEvent):
        print("orderEvent received")
        # TODO: add handling logic
    elif isinstance(event, UnknownEvent):
        print("Unknown event")
        # TODO: add unknown event handling

    # Step 4: Return 200 OK to acknowledge receipt (adjust with other codes if needed).
    return Response(status=200)
```



