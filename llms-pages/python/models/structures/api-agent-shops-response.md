# Api Agent Shops Response

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwQWdlbnQlMjUyMFNob3BzJTI1MjBSZXNwb25zZQ


# Class Name

`ApiAgentShopsResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `shops` | [`List[AgentShopSummary]`](/llms-pages/python/models/structures/agent-shop-summary.md) | Required | - |
| `mcp_server` | `str` | Required | The MCP server to order through. |


# Example

```python
from onethingapi.models.agent_shop_summary import AgentShopSummary
from onethingapi.models.api_agent_shops_response import ApiAgentShopsResponse
from onethingapi.models.kind_1 import Kind1

api_agent_shops_response = ApiAgentShopsResponse(
    shops=[
        AgentShopSummary(
            shop='shop0',
            name='name0',
            kind=Kind1.PHYSICAL,
            headline='headline0',
            price='price2',
            url='url4'
        )
    ],
    mcp_server='mcp_server0'
)
```



