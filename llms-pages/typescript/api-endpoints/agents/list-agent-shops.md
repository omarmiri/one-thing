# List Agent Shops

Source: /#/typescript/x-redirect/JTI0ZSUyRkFnZW50cyUyRmxpc3RBZ2VudFNob3Bz

The gallery's live shops, newest first, filtered by keywords (every word must appear in the name or headline). The GET twin of the MCP `search_shops` tool, for agents that can only fetch URLs. Public. Read a shop with `getAgentProduct`; buy through the MCP server in `mcp_server`, or send the buyer to the shop's `url`.

:information_source: **Note** This endpoint does not require authentication.

```ts
async listAgentShops(
  q?: string,
  limit?: number,
  requestOptions?: RequestOptions
): Promise<ApiResponse<ApiAgentShopsResponse>>
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `q` | `string \| undefined` | Query, Optional | Keywords. Leave out to list the newest shops.<br><br>**Constraints**: *Maximum Length*: `200` |
| `limit` | `number \| undefined` | Query, Optional | How many shops, 1–25.<br><br>**Default**: `10`<br><br>**Constraints**: `>= 1`, `<= 25` |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: The matching shops.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`ApiAgentShopsResponse`](/llms-pages/typescript/models/structures/api-agent-shops-response.md).


# Example Usage

```ts
const q = 'skates';

const limit = 10;

try {
  const response = await agentsApi.listAgentShops(
    q,
    limit
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
  }
}
```


# Example Response *(as JSON)*

```json
{
  "shops": [
    {
      "shop": "vintageskates",
      "name": "Vintage Cream and Red Roller Skates",
      "kind": "physical",
      "headline": "Classic quad skates crafted with walnut burl heels",
      "price": "$240.00",
      "url": "https://one-thing-ash0.onrender.com/vintageskates"
    },
    {
      "shop": "raptorrush",
      "name": "Raptor Rush: Browser Edition",
      "kind": "digital",
      "headline": "Grow from Tiny Hatchling to Giant Apex Predator",
      "price": "$2.99",
      "url": "https://one-thing-ash0.onrender.com/raptorrush"
    }
  ],
  "mcp_server": "https://one-thing-ash0.onrender.com/api/mcp"
}
```



