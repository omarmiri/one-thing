# Get Agent Product

Source: /#/typescript/x-redirect/JTI0ZSUyRkFnZW50cyUyRmdldEFnZW50UHJvZHVjdA

Everything an AI shopping agent needs to describe the product and decide to buy it: price, shipping, delivery, availability, options, images and FAQ. Public. Buying goes through the MCP server named in `mcp_server`. Shop pages also carry the same facts as schema.org `Product` JSON-LD.

:information_source: **Note** This endpoint does not require authentication.

```ts
async getAgentProduct(
  slug: string,
  agent?: string,
  requestOptions?: RequestOptions
): Promise<ApiResponse<AgentProduct>>
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `string` | Template, Required | The shop's link name (current or former). |
| `agent` | `string \| undefined` | Query, Optional | Optional: the agent's name (`ChatGPT`, `Gemini`, `my-shopping-bot`), so the seller's stats show which agent sent the buyer. Only used when the user agent doesn't already say.<br><br>**Constraints**: *Maximum Length*: `30` |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: The product.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`AgentProduct`](/llms-pages/typescript/models/structures/agent-product.md).


# Example Usage

```ts
const slug = 'raptorrush';

const agent = 'ChatGPT';

try {
  const response = await agentsApi.getAgentProduct(
    slug,
    agent
  );

  // Extracting fully parsed response body.
  console.log(response.result);

  // Extracting response status code.
  console.log(response.statusCode);
  // Extracting response headers.
  console.log(response.headers);
  // Extracting response body of type `string | Stream`
  console.log(response.body);
} catch (error) {
  if (error instanceof ApiError) {
    // Extracting response error status code.
    console.log(error.statusCode);
    // Extracting response error headers.
    console.log(error.headers);
    // Extracting response error body of type `string | Stream`.
    console.log(error.body);
    if (error instanceof CustomError) {
      console.log(error.result);
    }
  }
}
```


# Example Response *(as JSON)*

```json
{
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
      "order_url": "https://one-thing-ash0.onrender.com/api/agent/shops/vintageskates/order?Size=7"
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
      "order_url": "https://one-thing-ash0.onrender.com/api/agent/shops/vintageskates/order?Size=9"
    }
  ],
  "availability": "in_stock",
  "how_to_buy": "Open the order_url of the buyer's variant (or call create_order on the OneThing MCP server with shop and options). Either returns a pay_url: give it to the buyer to pay at PayPal.",
  "mcp_server": "https://one-thing-ash0.onrender.com/api/mcp"
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | No live shop with that link name. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |



