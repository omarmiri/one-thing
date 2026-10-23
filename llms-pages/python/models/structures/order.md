# Order

Source: /#/python/x-redirect/JTI0bSUyRk9yZGVy


# Class Name

`Order`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `str` | Required | - |
| `paypal_order_id` | `str` | Optional | - |
| `status` | [`Status4`](/llms-pages/python/models/enumerations/status-4.md) | Required | - |
| `amount_cents` | `int` | Required | - |
| `shipping_cents` | `int` | Optional | - |
| `currency` | `str` | Required | - |
| `buyer_email` | `str` | Optional | - |
| `buyer_name` | `str` | Optional | - |
| `shipping_address` | `Dict[str, str]` | Optional | - |
| `capture_id` | `str` | Optional | - |
| `fulfillment_status` | [`FulfillmentStatus`](/llms-pages/python/models/enumerations/fulfillment-status.md) | Required | - |
| `carrier` | `str` | Optional | - |
| `tracking_number` | `str` | Optional | - |
| `tracking_synced` | `bool` | Optional | - |
| `downloads` | `int` | Optional | - |
| `access_code` | `str` | Optional | - |
| `code_uses` | `int` | Optional | - |
| `channel` | [`Channel`](/llms-pages/python/models/enumerations/channel.md) | Optional | `agent` for orders an AI agent placed through the MCP server. |
| `options` | `Dict[str, str]` | Optional | The buyer's pick, one value per option, keyed by option name (see `Choice`). |
| `paid_at` | `datetime` | Optional | - |
| `created_at` | `datetime` | Optional | - |


# Example

```python
from onethingapi.models.fulfillment_status import FulfillmentStatus
from onethingapi.models.order import Order
from onethingapi.models.status_4 import Status4

order = Order(
    id='id6',
    status=Status4.CREATED,
    amount_cents=96,
    currency='currency6',
    fulfillment_status=FulfillmentStatus.NONE,
    paypal_order_id='paypal_order_id6',
    shipping_cents=106,
    buyer_email='buyer_email8',
    buyer_name='buyer_name4',
    shipping_address={
        'key0': 'shipping_address6',
        'key1': 'shipping_address5',
        'key2': 'shipping_address4'
    }
)
```



