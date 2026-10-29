# Api Agent Shops Response

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwQWdlbnQlMjUyMFNob3BzJTI1MjBSZXNwb25zZQ


# Interface Name

`ApiAgentShopsResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `showBuyer` | `string` | Required | A suggested reply to the buyer, in Markdown: each shop's cover photo as an image, its name, price and headline, then "Which one?". Chats that block images from other sites just leave the image lines out. |
| `shops` | [`AgentShopSummary[]`](/llms-pages/typescript/models/structures/agent-shop-summary.md) | Required | - |
| `matched` | `boolean` | Required | False when nothing matched the query and `shops` is the newest gallery shops instead; `show_buyer` then starts by saying so. |
| `mcpServer` | `string` | Required | The MCP server to order through. |


# Example

```ts
import { ApiAgentShopsResponse, Kind1 } from 'one-thing-sdk';

const apiAgentShopsResponse: ApiAgentShopsResponse = {
  showBuyer: 'show_buyer0',
  shops: [
    {
      shop: 'shop0',
      name: 'name0',
      kind: Kind1.Physical,
      headline: 'headline0',
      price: 'price2',
      image: 'image6',
      url: 'url4',
    }
  ],
  matched: false,
  mcpServer: 'mcp_server4',
};
```



