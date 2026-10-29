# Api Platform Shops Response

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwUGxhdGZvcm0lMjUyMFNob3BzJTI1MjBSZXNwb25zZQ

The account's shops.


# Class Name

`ApiPlatformShopsResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `shops` | [`List[PlatformShop]`](/llms-pages/python/models/structures/platform-shop.md) | Required | Shops, newest first. |


# Example

```python
import dateutil.parser

from onethingapi.models.agent_money import AgentMoney
from onethingapi.models.api_platform_shops_response import ApiPlatformShopsResponse
from onethingapi.models.platform_shop import PlatformShop
from onethingapi.models.product_type_3 import ProductType3
from onethingapi.models.status_3 import Status3

api_platform_shops_response = ApiPlatformShopsResponse(
    shops=[
        PlatformShop(
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
    ]
)
```



