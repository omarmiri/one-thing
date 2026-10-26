# Agent Product

Source: /#/typescript/x-redirect/JTI0bSUyRkFnZW50UHJvZHVjdA

A live shop as an AI agent sees it. Recommendations have `offers`; everything else has `price` and is bought with `create_order`.


# Interface Name

`AgentProduct`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `showBuyer` | `string \| undefined` | Optional | A suggested reply to the buyer, in Markdown with the links already written as links: the product and its options to pick from, the pay link, or what they got with a receipt link. Buyers have the best experience when agents show it as written. |
| `agentName` | `string \| undefined` | Optional | Who this request was credited to in the seller's stats: a recognised user agent, else the name the agent gave itself (`?agent=`, or the MCP client's name), else the user agent's first word. |
| `shop` | `string` | Required | The link name, which the MCP tools take as `shop`. |
| `url` | `string` | Required | - |
| `name` | `string` | Required | - |
| `kind` | [`Kind1`](/llms-pages/typescript/models/enumerations/kind-1.md) | Required | - |
| `headline` | `string` | Required | - |
| `description` | `string` | Required | - |
| `highlights` | `string[]` | Required | - |
| `details` | [`Detail[]`](/llms-pages/typescript/models/structures/detail.md) | Required | - |
| `faq` | [`Faq[]`](/llms-pages/typescript/models/structures/faq.md) | Required | - |
| `images` | `string[]` | Required | - |
| `price` | [`AgentMoney \| undefined`](/llms-pages/typescript/models/structures/agent-money.md) | Optional | - |
| `shipping` | [`AgentProductShipping \| null \| undefined`](/llms-pages/typescript/models/oneof-anyof-definitions/agent-product-shipping.md) | Optional | This is a container for one-of cases. |
| `total` | [`AgentMoney \| undefined`](/llms-pages/typescript/models/structures/agent-money.md) | Optional | - |
| `delivery` | `string \| undefined` | Optional | - |
| `availability` | `string \| undefined` | Optional | - |
| `options` | [`Option1[] \| undefined`](/llms-pages/typescript/models/structures/option-1.md) | Optional | Pass one value per option to `create_order`. |
| `variants` | [`Variant[] \| undefined`](/llms-pages/typescript/models/structures/variant.md) | Optional | - |
| `orderUrl` | `string \| undefined` | Optional | Products without options: `orderByLink`, which orders one unit with a GET. Left out when sold out. With options, each variant has its own. |
| `offers` | [`Offer1[] \| undefined`](/llms-pages/typescript/models/structures/offer-1.md) | Optional | Recommendations only. Bought at the retailer. |
| `howToBuy` | `string` | Required | - |
| `mcpServer` | `string \| undefined` | Optional | The MCP server to order through (`getAgentProduct` only). |


# Example

```ts
import { AgentProduct, Kind1 } from 'one-thing-sdk';

const agentProduct: AgentProduct = {
  shop: 'shop2',
  url: 'url6',
  name: 'name2',
  kind: Kind1.Referral,
  headline: 'headline8',
  description: 'description2',
  highlights: [
    'highlights1'
  ],
  details: [
    {
      label: 'label0',
      value: 'value2',
    }
  ],
  faq: [
    {
      q: 'q0',
      a: 'a8',
    }
  ],
  images: [
    'images1',
    'images0'
  ],
  howToBuy: 'how_to_buy8',
  showBuyer: 'show_buyer2',
  agentName: 'agent_name0',
  price: {
    amount: 150.74,
    currency: 'currency2',
    label: 'label2',
  },
  shipping: {
    amount: 194.54,
    currency: 'currency2',
    shipsTo: [
      'ships_to5',
      'ships_to6',
      'ships_to7'
    ],
  },
  total: {
    amount: 71.32,
    currency: 'currency0',
    label: 'label0',
  },
  delivery: 'Shipped. PayPal collects the buyer\'s address at checkout.',
  availability: 'in_stock',
};
```



