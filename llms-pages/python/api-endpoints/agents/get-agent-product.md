# Get Agent Product

Source: /#/python/x-redirect/JTI0ZSUyRkFnZW50cyUyRmdldEFnZW50UHJvZHVjdA

Everything an AI shopping agent needs to describe the product and decide to buy it: price, shipping, delivery, availability, options, images and FAQ. Public. Buying goes through the MCP server named in `mcp_server`, or the `order_url` links. Shop pages also carry the same facts as schema.org `Product` JSON-LD. A person clicking the link in a browser (`Sec-Fetch-User: ?1`) is redirected instead; known assistants and headless browsers always get JSON. It goes to the shop page, unless the link has `?view=json`.

:information_source: **Note** This endpoint does not require authentication.

```python
def get_agent_product(self,
                     slug,
                     agent=None,
                     view=None)
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Template, Required | The shop's link name (current or former). |
| `agent` | `str` | Query, Optional | Optional: the agent's name (`ChatGPT`, `Gemini`, `my-shopping-bot`), so the seller's stats show which agent sent the buyer. Only used when the user agent doesn't already say.<br><br>**Constraints**: *Maximum Length*: `30` |
| `view` | [`View`](/llms-pages/python/models/enumerations/view.md) | Query, Optional | `json` keeps the JSON for a person opening the link in a browser. |


# Response Type

**200**: The product.

[`AgentProduct`](/llms-pages/python/models/structures/agent-product.md)


# Example Usage

```python
slug = 'vintageskates'

agent = 'ChatGPT'

view = View.JSON

result = agents_api.get_agent_product(
    slug,
    agent=agent,
    view=view
)
print(result)
```


# Example Response *(as JSON)*

```json
{
  "show_buyer": "![Vintage Cream and Red Roller Skates](https://one-thing-ash0.onrender.com/api/blobs/LFRvGuTU3D8i334X)\n\n**Vintage Cream and Red Roller Skates**: $240.00 + $15.00 shipping\nClassic quad skates crafted with walnut burl heels\nSize: 7 · 8 · 9\nWhich size?",
  "shop": "vintageskates",
  "url": "https://one-thing-ash0.onrender.com/vintageskates",
  "name": "Vintage Cream and Red Roller Skates",
  "kind": "physical",
  "headline": "Classic quad skates crafted with walnut burl heels",
  "description": "A vintage pair of skates featuring cream leather, bold red trim, and durable quad wheels.",
  "highlights": [
    "Handmade cream leather upper with rich red trim",
    "Sculpted walnut burl heel structure for stability"
  ],
  "details": [
    {
      "label": "Materials",
      "value": "Leather upper, walnut burl heel, rubber wheels"
    }
  ],
  "faq": [
    {
      "q": "What is the return policy?",
      "a": "Unworn skates in original condition can be returned within 30 days of delivery."
    }
  ],
  "images": [
    "https://one-thing-ash0.onrender.com/api/blobs/LFRvGuTU3D8i334X",
    "https://one-thing-ash0.onrender.com/api/blobs/zrySajNyao6_j11x"
  ],
  "price": {
    "amount": 240,
    "currency": "USD",
    "label": "$240.00"
  },
  "shipping": {
    "amount": 15,
    "currency": "USD",
    "ships_to": [
      "US"
    ]
  },
  "total": {
    "amount": 255,
    "currency": "USD"
  },
  "delivery": "Shipped. PayPal collects the buyer's address at checkout.",
  "options": [
    {
      "name": "Size",
      "values": [
        "7",
        "8",
        "9"
      ]
    }
  ],
  "variants": [
    {
      "choice": {
        "Size": "7"
      },
      "availability": "in_stock (3 left)",
      "order_url": "https://one-thing-ash0.onrender.com/vintageskates/buy?Size=7"
    },
    {
      "choice": {
        "Size": "8"
      },
      "availability": "sold_out"
    },
    {
      "choice": {
        "Size": "9"
      },
      "availability": "in_stock (6 left)",
      "order_url": "https://one-thing-ash0.onrender.com/vintageskates/buy?Size=9"
    }
  ],
  "availability": "in_stock",
  "how_to_buy": "Show show_buyer to the buyer exactly as written, photo included (it's Markdown, so the photo displays and the links stay clickable), and keep your own words to a minimum. Once the buyer has picked and said to buy, open the order_url of their variant (or call create_order on the OneThing MCP server with shop and options). Either returns show_buyer with the pay link.",
  "mcp_server": "https://one-thing-ash0.onrender.com/api/mcp",
  "agent_name": "ChatGPT"
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | No live shop with that link name. | [`ErrorResponseException`](/llms-pages/python/models/exceptions/error-response.md) |



