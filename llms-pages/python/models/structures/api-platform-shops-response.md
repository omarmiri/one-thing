# Api Platform Shops Response

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwUGxhdGZvcm0lMjUyMFNob3BzJTI1MjBSZXNwb25zZQ


# Class Name

`ApiPlatformShopsResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `shops` | [`List[PlatformShop]`](/llms-pages/python/models/structures/platform-shop.md) | Required | - |


# Example

```python
import dateutil.parser

from onethingapi.models.agent_money import AgentMoney
from onethingapi.models.api_platform_shops_response import ApiPlatformShopsResponse
from onethingapi.models.platform_shop import PlatformShop
from onethingapi.models.product_type_1 import ProductType1
from onethingapi.models.status import Status

api_platform_shops_response = ApiPlatformShopsResponse(
    shops=[
        PlatformShop(
            slug='slug6',
            status=Status.DRAFT,
            name='name0',
            product_type=ProductType1.DIGITAL,
            price=AgentMoney(
                amount=48.5,
                currency='USD',
                label='$48.50'
            ),
            url='url4',
            paypal_connected=False,
            sales=28,
            created_at=dateutil.parser.parse('2016-03-13T12:52:32.123Z'),
            headline='headline0',
            cover='cover6'
        )
    ]
)
```



