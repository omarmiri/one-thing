# Api Agent Shops Response

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwQWdlbnQlMjUyMFNob3BzJTI1MjBSZXNwb25zZQ


# Class Name

`ApiAgentShopsResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `show_buyer` | `str` | Required | A suggested reply to the buyer, in Markdown: each shop's cover photo as an image, its name, price and headline, then "Which one?". Chats that block images from other sites just leave the image lines out. |
| `shops` | [`List[AgentShopSummary]`](/llms-pages/python/models/structures/agent-shop-summary.md) | Required | - |
| `matched` | `bool` | Required | False when nothing matched the query and `shops` is the newest gallery shops instead; `show_buyer` then starts by saying so. |
| `mcp_server` | `str` | Required | The MCP server to order through. |


# Example

```python
from onethingapi.models.agent_shop_summary import AgentShopSummary
from onethingapi.models.api_agent_shops_response import ApiAgentShopsResponse
from onethingapi.models.kind_1 import Kind1

api_agent_shops_response = ApiAgentShopsResponse(
    show_buyer='show_buyer4',
    shops=[
        AgentShopSummary(
            shop='shop0',
            name='name0',
            kind=Kind1.PHYSICAL,
            headline='headline0',
            price='price2',
            image='image6',
            url='url4'
        )
    ],
    matched=False,
    mcp_server='mcp_server0'
)
```



