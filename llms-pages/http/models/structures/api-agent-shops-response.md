# Api Agent Shops Response

Source: /#/http/x-redirect/JTI0bSUyRkFwaSUyNTIwQWdlbnQlMjUyMFNob3BzJTI1MjBSZXNwb25zZQ


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `shops` | [`array<Agent Shop Summary>`](/llms-pages/http/models/structures/agent-shop-summary.md) | Required | - |
| `mcp_server` | `String` | Required | The MCP server to order through. |


# Example (as JSON)

```json
{
  "shops": [
    {
      "shop": "shop0",
      "name": "name0",
      "kind": "physical",
      "headline": "headline0",
      "price": "price2",
      "url": "url4"
    }
  ],
  "mcp_server": "mcp_server2"
}
```



