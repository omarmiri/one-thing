# List Agent Shops

Source: /#/python/x-redirect/JTI0ZSUyRkFnZW50cyUyRmxpc3RBZ2VudFNob3Bz

The gallery's live shops, newest first, filtered by keywords (every word must appear in the name or headline). The GET twin of the MCP `search_shops` tool, for agents that can only fetch URLs. Public. Read a shop with `getAgentProduct`; buy through the MCP server in `mcp_server`, or send the buyer to the shop's `url`.

:information_source: **Note** This endpoint does not require authentication.

```python
def list_agent_shops(self,
                    q=None,
                    limit=10)
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `q` | `str` | Query, Optional | Keywords. Leave out to list the newest shops.<br><br>**Constraints**: *Maximum Length*: `200` |
| `limit` | `int` | Query, Optional | How many shops, 1–25.<br><br>**Default**: `10`<br><br>**Constraints**: `>= 1`, `<= 25` |


# Response Type

**200**: The matching shops.

[`ApiAgentShopsResponse`](/llms-pages/python/models/structures/api-agent-shops-response.md)


# Example Usage

```python
q = 'skates'

limit = 10

result = agents_api.list_agent_shops(
    q=q,
    limit=limit
)
print(result)
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



