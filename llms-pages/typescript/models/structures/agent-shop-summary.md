# Agent Shop Summary

Source: /#/typescript/x-redirect/JTI0bSUyRkFnZW50U2hvcFN1bW1hcnk

A shop in search results.


# Interface Name

`AgentShopSummary`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `shop` | `string` | Required | The link name, for `getAgentProduct` and the MCP tools. |
| `name` | `string` | Required | The product's name. |
| `kind` | [`Kind2`](/llms-pages/typescript/models/enumerations/kind-2.md) | Required | `physical`, `digital` or `referral`. |
| `headline` | `string` | Required | The shop's one-line pitch. |
| `price` | `string \| null` | Required | The price label, e.g. `$2.99`; null for recommendations. |
| `image` | `string \| null` | Required | The cover photo's URL (WebP; the retailer's image for a recommendation), or null when there's none. |
| `url` | `string` | Required | The shop page. |


# Example

```ts
import { AgentShopSummary, Kind2 } from 'one-thing-sdk';

const agentShopSummary: AgentShopSummary = {
  shop: 'vintageskates',
  name: 'Vintage Cream and Red Roller Skates',
  kind: Kind2.Physical,
  headline: 'Classic quad skates crafted with walnut burl heels',
  price: '$240.00',
  image: 'https://one-thing-ash0.onrender.com/api/blobs/LFRvGuTU3D8i334X',
  url: 'https://one-thing-ash0.onrender.com/vintageskates',
};
```



