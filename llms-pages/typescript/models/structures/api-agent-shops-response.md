# Api Agent Shops Response

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwQWdlbnQlMjUyMFNob3BzJTI1MjBSZXNwb25zZQ

The matching shops, with a reply to show the buyer.


# Interface Name

`ApiAgentShopsResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `showBuyer` | `string` | Required | A suggested reply to the buyer, in Markdown: each shop's cover photo as an image, its name, price and headline, then "Which one?". Chats that block images from other sites just leave the image lines out. |
| `shops` | [`AgentShopSummary[]`](/llms-pages/typescript/models/structures/agent-shop-summary.md) | Required | Shops, best match first. |
| `matched` | `boolean` | Required | False when nothing matched the query and `shops` is the newest gallery shops instead; `show_buyer` then starts by saying so. |
| `mcpServer` | `string` | Required | The MCP server to order through. |


# Example

```ts
import { ApiAgentShopsResponse, Kind2 } from 'one-thing-sdk';

const apiAgentShopsResponse: ApiAgentShopsResponse = {
  showBuyer: '![Vintage Cream and Red Roller Skates](https://one-thing-ash0.onrender.com/api/blobs/LFRvGuTU3D8i334X)\n\n**Vintage Cream and Red Roller Skates**: $240.00. Classic quad skates crafted with walnut burl heels\n\n![Raptor Rush: Browser Edition](https://one-thing-ash0.onrender.com/api/blobs/R9tWc3yN6bJq1zUd)\n\n**Raptor Rush: Browser Edition**: $2.99. Grow from Tiny Hatchling to Giant Apex Predator\n\nWhich one?',
  shops: [
    {
      shop: 'vintageskates',
      name: 'Vintage Cream and Red Roller Skates',
      kind: Kind2.Physical,
      headline: 'Classic quad skates crafted with walnut burl heels',
      price: '$240.00',
      image: 'https://one-thing-ash0.onrender.com/api/blobs/LFRvGuTU3D8i334X',
      url: 'https://one-thing-ash0.onrender.com/vintageskates',
    }
  ],
  matched: true,
  mcpServer: 'https://one-thing-ash0.onrender.com/api/mcp',
};
```



