# Order

Source: /#/python/x-redirect/JTI0bSUyRk9yZGVy

An order, as the seller sees it.


# Class Name

`Order`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `str` | Required | OneThing's order id. |
| `paypal_order_id` | `str` | Optional | PayPal's order id. |
| `status` | [`Status4`](/llms-pages/python/models/enumerations/status-4.md) | Required | `created` until paid; `failed` if PayPal declined; `refunded` after a refund. |
| `amount_cents` | `int` | Required | The total charged, shipping included, in cents. |
| `shipping_cents` | `int` | Optional | The shipping part of `amount_cents`. |
| `currency` | `str` | Required | ISO 4217 currency code. |
| `buyer_email` | `str` | Optional | From PayPal, once paid. |
| `buyer_name` | `str` | Optional | From PayPal, once paid. |
| `shipping_address` | `Dict[str, str]` | Optional | Physical orders: the address from PayPal checkout, by field. |
| `capture_id` | `str` | Optional | PayPal's capture id, once paid. Refunds use it. |
| `fulfillment_status` | [`FulfillmentStatus`](/llms-pages/python/models/enumerations/fulfillment-status.md) | Required | `to_ship` and `shipped` for physical orders, `digital_sent` for digital ones, `none` before payment. |
| `carrier` | `str` | Optional | Shipped orders: the carrier. |
| `tracking_number` | `str` | Optional | Shipped orders: the tracking number. |
| `tracking_synced` | `bool` | Optional | Whether PayPal accepted the tracking number. |
| `downloads` | `int` | Optional | How many times the buyer downloaded the file. |
| `access_code` | `str` | Optional | Access-code products: the code this buyer got. |
| `code_uses` | `int` | Optional | How many times the access code was checked. |
| `code_last_used_at` | `datetime` | Optional | When the access code was last checked with `verifyAccessCode`. |
| `channel` | [`Channel`](/llms-pages/python/models/enumerations/channel.md) | Optional | `agent` for orders an AI agent placed (MCP or an order link). |
| `agent` | `str` | Optional | The agent credited with an agent order, such as `Grok`. |
| `refund_id` | `str` | Optional | PayPal's refund id, once refunded through OneThing. |
| `refunded_at` | `datetime` | Optional | When the order was refunded. |
| `options` | `Dict[str, str]` | Optional | The buyer's pick, one value per option, keyed by option name (see `Choice`). |
| `paid_at` | `datetime` | Optional | When PayPal captured the payment. |
| `created_at` | `datetime` | Optional | When the order was made. |


# Example

```python
import dateutil.parser

from onethingapi.models.channel import Channel
from onethingapi.models.fulfillment_status import FulfillmentStatus
from onethingapi.models.order import Order
from onethingapi.models.status_4 import Status4

order = Order(
    id='pX4kR9tVb2nQ7sLe',
    status=Status4.CREATED,
    amount_cents=25500,
    currency='USD',
    fulfillment_status=FulfillmentStatus.NONE,
    paypal_order_id='5O190127TN364715T',
    shipping_cents=1500,
    buyer_email='sam@example.com',
    buyer_name='Sam Rivera',
    shipping_address={
        'address_line_1': '1 Main St',
        'admin_area_2': 'Springfield',
        'admin_area_1': 'IL',
        'postal_code': '62701',
        'country_code': 'US'
    },
    capture_id='3C679366HH908993F',
    carrier='USPS',
    tracking_number='9400111899223197428490',
    tracking_synced=False,
    downloads=0,
    access_code='K7QF-M2XP-9HTD',
    code_uses=0,
    code_last_used_at=dateutil.parser.parse('2026-10-22T02:41:37Z'),
    channel=Channel.WEB,
    agent='Grok',
    refund_id='1JU08902781691411',
    refunded_at=dateutil.parser.parse('2026-10-22T02:41:37Z'),
    options={
        'Size': '9'
    },
    paid_at=dateutil.parser.parse('2026-10-22T02:41:37Z'),
    created_at=dateutil.parser.parse('2026-10-22T02:41:37Z')
)
```



