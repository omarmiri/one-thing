# Api Agent Shops Response

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwQWdlbnQlMjUyMFNob3BzJTI1MjBSZXNwb25zZQ


# Interface Name

`ApiAgentShopsResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `shops` | [`AgentShopSummary[]`](/llms-pages/typescript/models/structures/agent-shop-summary.md) | Required | - |
| `mcpServer` | `string` | Required | The MCP server to order through. |


# Example

```ts
import { ApiAgentShopsResponse, Kind1 } from 'one-thing-sdk';

const apiAgentShopsResponse: ApiAgentShopsResponse = {
  shops: [
    {
      shop: 'shop0',
      name: 'name0',
      kind: Kind1.Physical,
      headline: 'headline0',
      price: 'price2',
      url: 'url4',
    }
  ],
  mcpServer: 'mcp_server4',
};
```



