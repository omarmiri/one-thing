# Agent Shop Summary

Source: /#/python/x-redirect/JTI0bSUyRkFnZW50U2hvcFN1bW1hcnk

A shop in search results.


# Class Name

`AgentShopSummary`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `shop` | `str` | Required | The link name, for `getAgentProduct` and the MCP tools. |
| `name` | `str` | Required | The product's name. |
| `kind` | [`Kind2`](/llms-pages/python/models/enumerations/kind-2.md) | Required | `physical`, `digital` or `referral`. |
| `headline` | `str` | Required | The shop's one-line pitch. |
| `price` | `str` | Required | The price label, e.g. `$2.99`; null for recommendations. |
| `image` | `str` | Required | The cover photo's URL (WebP; the retailer's image for a recommendation), or null when there's none. |
| `url` | `str` | Required | The shop page. |


# Example

```python
from onethingapi.models.agent_shop_summary import AgentShopSummary
from onethingapi.models.kind_2 import Kind2

agent_shop_summary = AgentShopSummary(
    shop='vintageskates',
    name='Vintage Cream and Red Roller Skates',
    kind=Kind2.PHYSICAL,
    headline='Classic quad skates crafted with walnut burl heels',
    price='$240.00',
    image='https://one-thing-ash0.onrender.com/api/blobs/LFRvGuTU3D8i334X',
    url='https://one-thing-ash0.onrender.com/vintageskates'
)
```



