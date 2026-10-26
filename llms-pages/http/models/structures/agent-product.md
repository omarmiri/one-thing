# Agent Product

Source: /#/http/x-redirect/JTI0bSUyRkFnZW50UHJvZHVjdA

A live shop as an AI agent sees it. Recommendations have `offers`; everything else has `price` and is bought with `create_order`.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `show_buyer` | `String` | Optional | A suggested reply to the buyer, in Markdown with the links already written as links: the product and its options to pick from, the pay link, or what they got with a receipt link. Buyers have the best experience when agents show it as written. |
| `agent_name` | `String` | Optional | Who this request was credited to in the seller's stats: a recognised user agent, else the name the agent gave itself (`?agent=`, or the MCP client's name), else the user agent's first word. |
| `shop` | `String` | Required | The link name, which the MCP tools take as `shop`. |
| `url` | `String` | Required | - |
| `name` | `String` | Required | - |
| `kind` | [`Kind 1`](/llms-pages/http/models/enumerations/kind-1.md) | Required | - |
| `headline` | `String` | Required | - |
| `description` | `String` | Required | - |
| `highlights` | `array<String>` | Required | - |
| `details` | [`array<Detail>`](/llms-pages/http/models/structures/detail.md) | Required | - |
| `faq` | [`array<Faq>`](/llms-pages/http/models/structures/faq.md) | Required | - |
| `images` | `array<String>` | Required | - |
| `price` | [`Agent Money`](/llms-pages/http/models/structures/agent-money.md) | Optional | - |
| `shipping` | [`Shipping`](/llms-pages/http/models/oneof-anyof-definitions/agent-product-shipping.md) | Optional | Physical products only. |
| `total` | [`Agent Money`](/llms-pages/http/models/structures/agent-money.md) | Optional | - |
| `delivery` | `String` | Optional | - |
| `availability` | `String` | Optional | - |
| `options` | [`array<Option 1>`](/llms-pages/http/models/structures/option-1.md) | Optional | Pass one value per option to `create_order`. |
| `variants` | [`array<Variant>`](/llms-pages/http/models/structures/variant.md) | Optional | - |
| `order_url` | `String` | Optional | Products without options: `orderByLink`, which orders one unit with a GET. Left out when sold out. With options, each variant has its own. |
| `offers` | [`array<Offer 1>`](/llms-pages/http/models/structures/offer-1.md) | Optional | Recommendations only. Bought at the retailer. |
| `how_to_buy` | `String` | Required | - |
| `mcp_server` | `String` | Optional | The MCP server to order through (`getAgentProduct` only). |


# Example (as JSON)

```json
{
  "shop": "shop6",
  "url": "url0",
  "name": "name6",
  "kind": "referral",
  "headline": "headline4",
  "description": "description6",
  "highlights": [
    "highlights5"
  ],
  "details": [
    {
      "label": "label0",
      "value": "value2"
    }
  ],
  "faq": [
    {
      "q": "q0",
      "a": "a8"
    }
  ],
  "images": [
    "images5",
    "images4",
    "images3"
  ],
  "delivery": "Shipped. PayPal collects the buyer's address at checkout.",
  "availability": "in_stock",
  "how_to_buy": "how_to_buy2",
  "show_buyer": "show_buyer4",
  "agent_name": "agent_name4",
  "price": {
    "amount": 150.74,
    "currency": "currency2",
    "label": "label2"
  },
  "shipping": {
    "amount": 194.54,
    "currency": "currency2",
    "ships_to": [
      "ships_to5",
      "ships_to6",
      "ships_to7"
    ]
  },
  "total": {
    "amount": 71.32,
    "currency": "currency0",
    "label": "label0"
  }
}
```



