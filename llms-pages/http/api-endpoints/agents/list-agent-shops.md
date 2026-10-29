# List Agent Shops

Source: /#/http/x-redirect/JTI0ZSUyRkFnZW50cyUyRmxpc3RBZ2VudFNob3Bz

The gallery's live shops for a query: shops matching more of its words first, newest first among equals. Browsing words ("something interesting to buy") are ignored, and a query that matches nothing returns the newest shops with `matched: false` rather than an empty list. The GET twin of the MCP `search_shops` tool, for agents that can only fetch URLs. Public. Read a shop with `getAgentProduct`; buy through the MCP server in `mcp_server`, or send the buyer to the shop's `url`.

:information_source: **Note** This endpoint does not require authentication.

```http
GET /api/agent/shops
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `q` | `String` | Query, Optional | Keywords. Leave out to list the newest shops.<br><br>**Constraints**: *Maximum Length*: `200` |
| `limit` | `Number` | Query, Optional | How many shops, 1–25.<br><br>**Default**: `10`<br><br>**Constraints**: `>= 1`, `<= 25` |


# Response Type

**200**: The matching shops.

[`Api Agent Shops Response`](/llms-pages/http/models/structures/api-agent-shops-response.md)


# Example Usage

```bash
curl -X GET -G \
  --url 'https://one-thing-ash0.onrender.com/api/agent/shops'  \
  -H 'Accept: application/json' \
  -d 'q=skates' \
  -d 'limit=10'
```


# Example Response *(as JSON)*

```json
{
  "show_buyer": "![Vintage Cream and Red Roller Skates](https://one-thing-ash0.onrender.com/api/blobs/LFRvGuTU3D8i334X)\n\n**Vintage Cream and Red Roller Skates**: $240.00. Classic quad skates crafted with walnut burl heels\n\n![Raptor Rush: Browser Edition](https://one-thing-ash0.onrender.com/api/blobs/R9tWc3yN6bJq1zUd)\n\n**Raptor Rush: Browser Edition**: $2.99. Grow from Tiny Hatchling to Giant Apex Predator\n\nWhich one?",
  "shops": [
    {
      "shop": "vintageskates",
      "name": "Vintage Cream and Red Roller Skates",
      "kind": "physical",
      "headline": "Classic quad skates crafted with walnut burl heels",
      "price": "$240.00",
      "image": "https://one-thing-ash0.onrender.com/api/blobs/LFRvGuTU3D8i334X",
      "url": "https://one-thing-ash0.onrender.com/vintageskates"
    },
    {
      "shop": "raptorrush",
      "name": "Raptor Rush: Browser Edition",
      "kind": "digital",
      "headline": "Grow from Tiny Hatchling to Giant Apex Predator",
      "price": "$2.99",
      "image": "https://one-thing-ash0.onrender.com/api/blobs/R9tWc3yN6bJq1zUd",
      "url": "https://one-thing-ash0.onrender.com/raptorrush"
    }
  ],
  "matched": true,
  "mcp_server": "https://one-thing-ash0.onrender.com/api/mcp"
}
```



