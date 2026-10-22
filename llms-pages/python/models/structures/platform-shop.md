# Platform Shop

Source: /#/python/x-redirect/JTI0bSUyRlBsYXRmb3JtU2hvcA


# Class Name

`PlatformShop`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Required | - |
| `status` | [`Status`](/llms-pages/python/models/enumerations/status.md) | Required | - |
| `name` | `str` | Required | - |
| `headline` | `str` | Optional | - |
| `product_type` | [`ProductType1`](/llms-pages/python/models/enumerations/product-type-1.md) | Required | - |
| `price` | [`AgentMoney`](/llms-pages/python/models/structures/agent-money.md) | Required | - |
| `url` | `str` | Required | The shop page buyers pay on. |
| `cover` | `str` | Optional | The cover image's URL. |
| `paypal_connected` | `bool` | Required | The seller connected a PayPal account that can be paid. |
| `sales` | `int` | Required | Paid orders. |
| `created_at` | `datetime` | Required | - |


# Example

```python
import dateutil.parser

from onethingapi.models.agent_money import AgentMoney
from onethingapi.models.platform_shop import PlatformShop
from onethingapi.models.product_type_1 import ProductType1
from onethingapi.models.status import Status

platform_shop = PlatformShop(
    slug='slug0',
    status=Status.DRAFT,
    name='name6',
    product_type=ProductType1.DIGITAL,
    price=AgentMoney(
        amount=48.5,
        currency='USD',
        label='$48.50'
    ),
    url='url0',
    paypal_connected=False,
    sales=2,
    created_at=dateutil.parser.parse('2016-03-13T12:52:32.123Z'),
    headline='headline4',
    cover='cover0'
)
```



