# Agent Product

Source: /#/python/x-redirect/JTI0bSUyRkFnZW50UHJvZHVjdA

A live shop as an AI agent sees it. Recommendations have `offers`; everything else has `price` and is bought with `create_order`.


# Class Name

`AgentProduct`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `shop` | `str` | Required | The link name, which the MCP tools take as `shop`. |
| `url` | `str` | Required | - |
| `name` | `str` | Required | - |
| `kind` | [`Kind1`](/llms-pages/python/models/enumerations/kind-1.md) | Required | - |
| `headline` | `str` | Required | - |
| `description` | `str` | Required | - |
| `highlights` | `List[str]` | Required | - |
| `details` | [`List[Detail]`](/llms-pages/python/models/structures/detail.md) | Required | - |
| `faq` | [`List[Faq]`](/llms-pages/python/models/structures/faq.md) | Required | - |
| `images` | `List[str]` | Required | - |
| `price` | [`AgentMoney`](/llms-pages/python/models/structures/agent-money.md) | Optional | - |
| `shipping` | [Shipping](/llms-pages/python/models/structures/shipping.md) \| None | Optional | This is a container for one-of cases. |
| `total` | [`AgentMoney`](/llms-pages/python/models/structures/agent-money.md) | Optional | - |
| `delivery` | `str` | Optional | - |
| `availability` | `str` | Optional | - |
| `options` | [`List[Option1]`](/llms-pages/python/models/structures/option-1.md) | Optional | Pass one value per option to `create_order`. |
| `variants` | [`List[Variant]`](/llms-pages/python/models/structures/variant.md) | Optional | - |
| `order_url` | `str` | Optional | Products without options: `orderByLink`, which orders one unit with a GET. Left out when sold out. With options, each variant has its own. |
| `offers` | [`List[Offer1]`](/llms-pages/python/models/structures/offer-1.md) | Optional | Recommendations only. Bought at the retailer. |
| `how_to_buy` | `str` | Required | - |
| `mcp_server` | `str` | Optional | The MCP server to order through (`getAgentProduct` only). |


# Example

```python
from onethingapi.models.agent_money import AgentMoney
from onethingapi.models.agent_product import AgentProduct
from onethingapi.models.detail import Detail
from onethingapi.models.faq import Faq
from onethingapi.models.kind_1 import Kind1
from onethingapi.models.shipping import Shipping

agent_product = AgentProduct(
    shop='shop6',
    url='url0',
    name='name6',
    kind=Kind1.PHYSICAL,
    headline='headline4',
    description='description4',
    highlights=[
        'highlights5',
        'highlights6',
        'highlights7'
    ],
    details=[
        Detail(
            label='label0',
            value='value2'
        )
    ],
    faq=[
        Faq(
            q='q0',
            a='a8'
        )
    ],
    images=[
        'images5',
        'images6'
    ],
    how_to_buy='how_to_buy2',
    price=AgentMoney(
        amount=150.74,
        currency='currency2',
        label='label2'
    ),
    shipping=Shipping(
        amount=194.54,
        currency='currency2',
        ships_to=[
            'ships_to5',
            'ships_to6',
            'ships_to7'
        ]
    ),
    total=AgentMoney(
        amount=71.32,
        currency='currency0',
        label='label0'
    ),
    delivery='Shipped. PayPal collects the buyer\'s address at checkout.',
    availability='in_stock'
)
```



