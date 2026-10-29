# Order

Source: /#/http/x-redirect/JTI0bSUyRk9yZGVy

An order, as the seller sees it.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `String` | Required | OneThing's order id. |
| `paypal_order_id` | `String` | Optional | PayPal's order id. |
| `status` | [`Status 4`](/llms-pages/http/models/enumerations/status-4.md) | Required | `created` until paid; `failed` if PayPal declined; `refunded` after a refund. |
| `amount_cents` | `Number` | Required | The total charged, shipping included, in cents. |
| `shipping_cents` | `Number` | Optional | The shipping part of `amount_cents`. |
| `currency` | `String` | Required | ISO 4217 currency code. |
| `buyer_email` | `String` | Optional | From PayPal, once paid. |
| `buyer_name` | `String` | Optional | From PayPal, once paid. |
| `shipping_address` | `map<String>` | Optional | Physical orders: the address from PayPal checkout, by field. |
| `capture_id` | `String` | Optional | PayPal's capture id, once paid. Refunds use it. |
| `fulfillment_status` | [`Fulfillment Status`](/llms-pages/http/models/enumerations/fulfillment-status.md) | Required | `to_ship` and `shipped` for physical orders, `digital_sent` for digital ones, `none` before payment. |
| `carrier` | `String` | Optional | Shipped orders: the carrier. |
| `tracking_number` | `String` | Optional | Shipped orders: the tracking number. |
| `tracking_synced` | `Boolean` | Optional | Whether PayPal accepted the tracking number. |
| `downloads` | `Number` | Optional | How many times the buyer downloaded the file. |
| `access_code` | `String` | Optional | Access-code products: the code this buyer got. |
| `code_uses` | `Number` | Optional | How many times the access code was checked. |
| `code_last_used_at` | `DateTime` | Optional | When the access code was last checked with `verifyAccessCode`. |
| `channel` | [`Channel`](/llms-pages/http/models/enumerations/channel.md) | Optional | `agent` for orders an AI agent placed (MCP or an order link). |
| `agent` | `String` | Optional | The agent credited with an agent order, such as `Grok`. |
| `refund_id` | `String` | Optional | PayPal's refund id, once refunded through OneThing. |
| `refunded_at` | `DateTime` | Optional | When the order was refunded. |
| `options` | `map<String>` | Optional | The buyer's pick, one value per option, keyed by option name (see `Choice`). |
| `paid_at` | `DateTime` | Optional | When PayPal captured the payment. |
| `created_at` | `DateTime` | Optional | When the order was made. |


# Example (as JSON)

```json
{
  "id": "pX4kR9tVb2nQ7sLe",
  "paypal_order_id": "5O190127TN364715T",
  "status": "created",
  "amount_cents": 25500,
  "shipping_cents": 1500,
  "currency": "USD",
  "buyer_email": "sam@example.com",
  "buyer_name": "Sam Rivera",
  "shipping_address": {
    "address_line_1": "1 Main St",
    "admin_area_2": "Springfield",
    "admin_area_1": "IL",
    "postal_code": "62701",
    "country_code": "US"
  },
  "capture_id": "3C679366HH908993F",
  "fulfillment_status": "none",
  "carrier": "USPS",
  "tracking_number": "9400111899223197428490",
  "tracking_synced": false,
  "downloads": 0,
  "access_code": "K7QF-M2XP-9HTD",
  "code_uses": 0,
  "code_last_used_at": "2026-10-22T02:41:37Z",
  "channel": "web",
  "agent": "Grok",
  "refund_id": "1JU08902781691411",
  "refunded_at": "2026-10-22T02:41:37Z",
  "options": {
    "Size": "9"
  },
  "paid_at": "2026-10-22T02:41:37Z",
  "created_at": "2026-10-22T02:41:37Z"
}
```



