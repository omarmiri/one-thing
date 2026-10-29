# Api Agent Shops Response

Source: /#/http/x-redirect/JTI0bSUyRkFwaSUyNTIwQWdlbnQlMjUyMFNob3BzJTI1MjBSZXNwb25zZQ


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `show_buyer` | `String` | Required | A suggested reply to the buyer, in Markdown: each shop's cover photo as an image, its name, price and headline, then "Which one?". Chats that block images from other sites just leave the image lines out. |
| `shops` | [`array<Agent Shop Summary>`](/llms-pages/http/models/structures/agent-shop-summary.md) | Required | - |
| `matched` | `Boolean` | Required | False when nothing matched the query and `shops` is the newest gallery shops instead; `show_buyer` then starts by saying so. |
| `mcp_server` | `String` | Required | The MCP server to order through. |


# Example (as JSON)

```json
{
  "show_buyer": "show_buyer2",
  "shops": [
    {
      "shop": "shop0",
      "name": "name0",
      "kind": "physical",
      "headline": "headline0",
      "price": "price2",
      "image": "image6",
      "url": "url4"
    }
  ],
  "matched": false,
  "mcp_server": "mcp_server2"
}
```



