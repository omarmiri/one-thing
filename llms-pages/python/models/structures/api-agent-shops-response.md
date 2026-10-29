# Api Agent Shops Response

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwQWdlbnQlMjUyMFNob3BzJTI1MjBSZXNwb25zZQ

The matching shops, with a reply to show the buyer.


# Class Name

`ApiAgentShopsResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `show_buyer` | `str` | Required | A suggested reply to the buyer, in Markdown: each shop's cover photo as an image, its name, price and headline, then "Which one?". Chats that block images from other sites just leave the image lines out. |
| `shops` | [`List[AgentShopSummary]`](/llms-pages/python/models/structures/agent-shop-summary.md) | Required | Shops, best match first. |
| `matched` | `bool` | Required | False when nothing matched the query and `shops` is the newest gallery shops instead; `show_buyer` then starts by saying so. |
| `mcp_server` | `str` | Required | The MCP server to order through. |


# Example

```python
from onethingapi.models.agent_shop_summary import AgentShopSummary
from onethingapi.models.api_agent_shops_response import ApiAgentShopsResponse
from onethingapi.models.kind_2 import Kind2

api_agent_shops_response = ApiAgentShopsResponse(
    show_buyer='![Vintage Cream and Red Roller Skates](https://one-thing-ash0.onrender.com/api/blobs/LFRvGuTU3D8i334X)\n\n**Vintage Cream and Red Roller Skates**: $240.00. Classic quad skates crafted with walnut burl heels\n\n![Raptor Rush: Browser Edition](https://one-thing-ash0.onrender.com/api/blobs/R9tWc3yN6bJq1zUd)\n\n**Raptor Rush: Browser Edition**: $2.99. Grow from Tiny Hatchling to Giant Apex Predator\n\nWhich one?',
    shops=[
        AgentShopSummary(
            shop='vintageskates',
            name='Vintage Cream and Red Roller Skates',
            kind=Kind2.PHYSICAL,
            headline='Classic quad skates crafted with walnut burl heels',
            price='$240.00',
            image='https://one-thing-ash0.onrender.com/api/blobs/LFRvGuTU3D8i334X',
            url='https://one-thing-ash0.onrender.com/vintageskates'
        )
    ],
    matched=True,
    mcp_server='https://one-thing-ash0.onrender.com/api/mcp'
)
```



