# Agent Shop Summary

Source: /#/python/x-redirect/JTI0bSUyRkFnZW50U2hvcFN1bW1hcnk


# Class Name

`AgentShopSummary`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `shop` | `str` | Required | The link name, for `getAgentProduct` and the MCP tools. |
| `name` | `str` | Required | - |
| `kind` | [`Kind1`](/llms-pages/python/models/enumerations/kind-1.md) | Required | - |
| `headline` | `str` | Required | - |
| `price` | `str` | Required | The price label, e.g. `$2.99`; null for recommendations. |
| `image` | `str` | Required | The cover photo's URL (WebP; the retailer's image for a recommendation), or null when there's none. |
| `url` | `str` | Required | The shop page. |


# Example

```python
from onethingapi.models.agent_shop_summary import AgentShopSummary
from onethingapi.models.kind_1 import Kind1

agent_shop_summary = AgentShopSummary(
    shop='shop4',
    name='name4',
    kind=Kind1.REFERRAL,
    headline='headline6',
    price='price2',
    image='image2',
    url='url8'
)
```



