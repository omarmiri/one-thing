# Agent Product

Source: /#/python/x-redirect/JTI0bSUyRkFnZW50UHJvZHVjdA

A live shop as an AI agent sees it. Recommendations have `offers`; everything else has `price` and is bought with `create_order`.


# Class Name

`AgentProduct`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `show_buyer` | `str` | Optional | A suggested reply to the buyer, in Markdown with the links already written as links: the product and its options to pick from, the pay link, or what they got with a receipt link. Buyers have the best experience when agents show it as written. |
| `agent_name` | `str` | Optional | Who this request was credited to in the seller's stats: a recognised user agent, else the name the agent gave itself (`?agent=`, or the MCP client's name), else the user agent's first word. |
| `shop` | `str` | Required | The link name, which the MCP tools take as `shop`. |
| `url` | `str` | Required | The shop page, where a person can buy it too. |
| `name` | `str` | Required | The product's name. |
| `kind` | [`Kind1`](/llms-pages/python/models/enumerations/kind-1.md) | Required | `physical` ships, `digital` downloads or unlocks with a code, `referral` is bought at another store. |
| `headline` | `str` | Required | The shop's one-line pitch. |
| `description` | `str` | Required | What the product is, in a few sentences. |
| `highlights` | `List[str]` | Required | The product's selling points, one per line. |
| `details` | [`List[Detail]`](/llms-pages/python/models/structures/detail.md) | Required | Product facts, such as size, material or format. |
| `faq` | [`List[Faq]`](/llms-pages/python/models/structures/faq.md) | Required | Questions buyers ask, answered by the seller's page. |
| `images` | `List[str]` | Required | Photo URLs, the cover first. Show these rather than generating or searching for images. |
| `price` | [`AgentMoney`](/llms-pages/python/models/structures/agent-money.md) | Optional | An amount of money, as a number and as a label. |
| `shipping` | [Shipping](/llms-pages/python/models/structures/shipping.md) \| None | Optional | This is a container for one-of cases. |
| `total` | [`AgentMoney`](/llms-pages/python/models/structures/agent-money.md) | Optional | An amount of money, as a number and as a label. |
| `delivery` | `str` | Optional | How the buyer gets it, in plain words. |
| `availability` | `str` | Optional | `in_stock`, `in_stock (N left)` or `sold_out`. With options, see `variants`. |
| `options` | [`List[Option1]`](/llms-pages/python/models/structures/option-1.md) | Optional | Pass one value per option to `create_order`. |
| `variants` | [`List[Variant]`](/llms-pages/python/models/structures/variant.md) | Optional | Products with options: each combination, its stock and its order link. |
| `order_url` | `str` | Optional | Products without options: `orderByLink`, which orders one unit with a GET. Left out when sold out. With options, each variant has its own. |
| `offers` | [`List[Offer1]`](/llms-pages/python/models/structures/offer-1.md) | Optional | Recommendations only. Bought at the retailer. |
| `how_to_buy` | `str` | Required | How to buy it, written for an agent: which tool or link to use and what to ask the buyer. |
| `mcp_server` | `str` | Optional | The MCP server to order through (`getAgentProduct` only). |


# Example

```python
from onethingapi.models.agent_money import AgentMoney
from onethingapi.models.agent_product import AgentProduct
from onethingapi.models.detail import Detail
from onethingapi.models.faq import Faq
from onethingapi.models.kind_1 import Kind1
from onethingapi.models.offer_1 import Offer1
from onethingapi.models.option_1 import Option1
from onethingapi.models.shipping import Shipping
from onethingapi.models.variant import Variant

agent_product = AgentProduct(
    shop='vintageskates',
    url='https://one-thing-ash0.onrender.com/vintageskates',
    name='Vintage Cream and Red Roller Skates',
    kind=Kind1.PHYSICAL,
    headline='Classic quad skates crafted with walnut burl heels',
    description='Vintage cream and red quad roller skates with walnut burl heels.',
    highlights=[
        'Walnut burl heels',
        'Restored vintage leather'
    ],
    details=[
        Detail(
            label='Material',
            value='Leather upper, walnut burl heel, rubber wheels'
        )
    ],
    faq=[
        Faq(
            q='Are these suitable for outdoor skating?',
            a='Yes, on indoor rink floors and paved outdoor paths.'
        )
    ],
    images=[
        'https://one-thing-ash0.onrender.com/api/blobs/LFRvGuTU3D8i334X'
    ],
    how_to_buy='Ask the buyer which size, then open that variant\'s order_url and show them pay_url.',
    show_buyer='![Vintage Cream and Red Roller Skates](https://one-thing-ash0.onrender.com/api/blobs/LFRvGuTU3D8i334X)\n\n**Vintage Cream and Red Roller Skates**: $240.00. Classic quad skates crafted with walnut burl heels\n\n![Raptor Rush: Browser Edition](https://one-thing-ash0.onrender.com/api/blobs/R9tWc3yN6bJq1zUd)\n\n**Raptor Rush: Browser Edition**: $2.99. Grow from Tiny Hatchling to Giant Apex Predator\n\nWhich one?',
    agent_name='Grok',
    price=AgentMoney(
        amount=240,
        currency='USD',
        label='$240.00'
    ),
    shipping=Shipping(
        amount=15,
        currency='USD',
        ships_to=[
            'US',
            'CA'
        ]
    ),
    total=AgentMoney(
        amount=240,
        currency='USD',
        label='$240.00'
    ),
    delivery='Shipped. PayPal collects the buyer\'s address at checkout.',
    availability='in_stock',
    options=[
        Option1(
            name='Size',
            values=[
                '7',
                '8',
                '9'
            ]
        )
    ],
    variants=[
        Variant(
            choice={
                'Size': 'M',
                'Color': 'Black'
            },
            availability='in_stock (3 left)',
            order_url='https://one-thing-ash0.onrender.com/vintageskates/buy?Size=9'
        )
    ],
    order_url='https://one-thing-ash0.onrender.com/vintageskates/buy?Size=9',
    offers=[
        Offer1(
            retailer='rei.com',
            price=240,
            currency='USD',
            in_stock=True,
            url='https://buy.trychannel3.com/r/abc123'
        )
    ],
    mcp_server='https://one-thing-ash0.onrender.com/api/mcp'
)
```



