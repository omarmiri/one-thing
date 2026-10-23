# Order by Link

Source: /#/http/x-redirect/JTI0ZSUyRkFnZW50cyUyRm9yZGVyQnlMaW5r

Orders one unit with a GET: the MCP `create_order` tool for AI assistants that can only
fetch URLs, such as free-tier ChatGPT or Grok. Nothing is charged. The reply has `pay_url`,
where the buyer pays at PayPal, and `status_url` (`getAgentOrder`), which says when they
have and what they got.

For a product with options, pass the buyer's pick as query parameters named after the
options (`?Size=9`, or `?Color=Ice+Blue&Size=L`); names and values are matched without
regard to case. You rarely build this URL yourself: `getAgentProduct` and `/llms.txt`
write it out in full (`order_url`, or `variants[].order_url`), because some assistants
only open URLs they have been shown.

Every request makes a new order, so open it once, after the buyer says to buy. A link
previewer opening it leaves an unpaid order at most: stock is only taken when a payment
is captured. Replies are `no-store` and `X-Robots-Tag: noindex, nofollow`.

:information_source: **Note** This endpoint does not require authentication.

```http
GET /api/agent/shops/{slug}/order
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Template, Required | The shop's link name (current or former). |
| `Size` | `String` | Query, Optional | An example option. The real parameter names are the product's option names from `getAgentProduct` (`options[].name`), one per option. |


# Response Type

**200**: The order, waiting for the buyer to pay.

[`Agent Created Order`](/llms-pages/http/models/structures/agent-created-order.md)


# Example Usage

```bash
curl -X GET -G \
  --url 'https://one-thing-ash0.onrender.com/api/agent/shops/raptorrush/order'  \
  -H 'Accept: application/json' \
  -d 'Size=9'
```


# Example Response *(as JSON)*

```json
{
  "order_id": "pX4kR9tVb2nQ7sLe",
  "status": "awaiting_buyer_approval",
  "total": "$255.00",
  "options": {
    "Size": "9"
  },
  "pay_url": "https://one-thing-ash0.onrender.com/o/pX4kR9tVb2nQ7sLe",
  "status_url": "https://one-thing-ash0.onrender.com/api/agent/orders/pX4kR9tVb2nQ7sLe",
  "next_step": "Show pay_url to the buyer as a link. It opens PayPal, where they pay (and enter a shipping address for physical items). When they say they've paid, call get_order with order_id (or open status_url): it returns the access code, download link or shipping details."
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | A missing or unknown option value, or sold out. `error` names the valid values. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |
| 404 | No live shop with that link name. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |



