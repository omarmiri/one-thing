# Platform Shop

Source: /#/python/x-redirect/JTI0bSUyRlBsYXRmb3JtU2hvcA

A shop as a platform API key lists it.


# Class Name

`PlatformShop`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Required | The shop's link name. |
| `status` | [`Status3`](/llms-pages/python/models/enumerations/status-3.md) | Required | `draft` until the seller goes live. |
| `name` | `str` | Required | The product's name. |
| `headline` | `str` | Optional | The shop's one-line pitch. |
| `product_type` | [`ProductType3`](/llms-pages/python/models/enumerations/product-type-3.md) | Required | `physical`, `digital` or `referral`. |
| `price` | [`AgentMoney`](/llms-pages/python/models/structures/agent-money.md) | Required | An amount of money, as a number and as a label. |
| `url` | `str` | Required | The shop page buyers pay on. |
| `cover` | `str` | Optional | The cover image's URL. |
| `paypal_connected` | `bool` | Required | The seller connected a PayPal account that can be paid. |
| `sales` | `int` | Required | Paid orders. |
| `created_at` | `datetime` | Required | When the shop was made. |


# Example

```python
import dateutil.parser

from onethingapi.models.agent_money import AgentMoney
from onethingapi.models.platform_shop import PlatformShop
from onethingapi.models.product_type_3 import ProductType3
from onethingapi.models.status_3 import Status3

platform_shop = PlatformShop(
    slug='vintageskates',
    status=Status3.DRAFT,
    name='Vintage Cream and Red Roller Skates',
    product_type=ProductType3.PHYSICAL,
    price=AgentMoney(
        amount=240,
        currency='USD',
        label='$240.00'
    ),
    url='https://one-thing-ash0.onrender.com/vintageskates',
    paypal_connected=True,
    sales=12,
    created_at=dateutil.parser.parse('2026-10-22T02:41:37Z'),
    headline='Classic quad skates crafted with walnut burl heels',
    cover='https://one-thing-ash0.onrender.com/api/blobs/LFRvGuTU3D8i334X'
)
```



