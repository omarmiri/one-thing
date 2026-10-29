# Agent Shop Summary

Source: /#/typescript/x-redirect/JTI0bSUyRkFnZW50U2hvcFN1bW1hcnk


# Interface Name

`AgentShopSummary`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `shop` | `string` | Required | The link name, for `getAgentProduct` and the MCP tools. |
| `name` | `string` | Required | - |
| `kind` | [`Kind1`](/llms-pages/typescript/models/enumerations/kind-1.md) | Required | - |
| `headline` | `string` | Required | - |
| `price` | `string \| null` | Required | The price label, e.g. `$2.99`; null for recommendations. |
| `image` | `string \| null` | Required | The cover photo's URL (WebP; the retailer's image for a recommendation), or null when there's none. |
| `url` | `string` | Required | The shop page. |


# Example

```ts
import { AgentShopSummary, Kind1 } from 'one-thing-sdk';

const agentShopSummary: AgentShopSummary = {
  shop: 'shop8',
  name: 'name8',
  kind: Kind1.Physical,
  headline: 'headline2',
  price: 'price4',
  image: 'image8',
  url: 'url2',
};
```



