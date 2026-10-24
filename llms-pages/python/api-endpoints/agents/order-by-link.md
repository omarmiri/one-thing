# Order by Link

Source: /#/python/x-redirect/JTI0ZSUyRkFnZW50cyUyRm9yZGVyQnlMaW5r

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

```python
def order_by_link(self,
                 slug,
                 agent=None,
                 size=None)
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Template, Required | The shop's link name (current or former). |
| `agent` | `str` | Query, Optional | Optional: the agent's name (`ChatGPT`, `Gemini`, `my-shopping-bot`), so the seller's stats show which agent sent the buyer. Only used when the user agent doesn't already say.<br><br>**Constraints**: *Maximum Length*: `30` |
| `size` | `str` | Query, Optional | An example option. The real parameter names are the product's option names from `getAgentProduct` (`options[].name`), one per option. |


# Response Type

**200**: The order, waiting for the buyer to pay.

[`AgentCreatedOrder`](/llms-pages/python/models/structures/agent-created-order.md)


# Example Usage

```python
slug = 'raptorrush'

agent = 'ChatGPT'

size = '9'

result = agents_api.order_by_link(
    slug,
    agent=agent,
    size=size
)
print(result)
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
  "next_step": "Show pay_url to the buyer as a link. It opens PayPal, where they pay (and enter a shipping address for physical items). When they say they've paid, open status_url (or with MCP, call get_order with order_id): it returns the access code, download link or shipping details."
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | A missing or unknown option value, or sold out. `error` names the valid values. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 404 | No live shop with that link name. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |



