# Shop Update

Source: /#/python/x-redirect/JTI0bSUyRlNob3BVcGRhdGU

The fields to change. Anything left out stays as it is.


# Class Name

`ShopUpdate`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Optional | A new link name. The old one keeps redirecting. |
| `status` | [`Status`](/llms-pages/python/models/enumerations/status.md) | Optional | `live` publishes the shop; `draft` takes it down. |
| `product_type` | [`ProductType`](/llms-pages/python/models/enumerations/product-type.md) | Optional | `referral` only for shops created from Channel3. |
| `price` | `float` | Optional | The price in USD.<br><br>**Constraints**: `>= 0.5`, `<= 10000` |
| `shipping` | `float` | Optional | Shipping per order, in USD.<br><br>**Constraints**: `>= 0`, `<= 500` |
| `stock` | `int` | Optional | How many are for sale; null for unlimited.<br><br>**Constraints**: `>= 0` |
| `ship_countries` | `str` | Optional | Comma-separated ISO country codes; null or empty means anywhere PayPal ships. |
| `delivery` | [`Delivery1`](/llms-pages/python/models/enumerations/delivery-1.md) | Optional | Digital products: `file` or `access_code`. |
| `access_url` | `str` | Optional | Access-code products: where buyers enter their code. |
| `paypal_email` | `str` | Optional | The PayPal account paid when no account is connected. |
| `seller_email` | `str` | Optional | Where order notifications go. |
| `zapier_hook_url` | `str` | Optional | A Zapier Catch Hook for order events; null removes it. |
| `in_gallery` | `bool` | Optional | Feature the shop at `/gallery` while it's live. Off by default. |
| `options` | [`List[ShopOption]`](/llms-pages/python/models/structures/shop-option.md) | Optional | What the buyer picks (physical products only), replacing the current options; `[]` removes them. With options, stock is counted per combination in `option_stock` and the shop's own `stock` is cleared. At most 60 combinations.<br><br>**Constraints**: *Maximum Items*: `3` |
| `option_stock` | `Dict[str, int]` | Optional | Stock per combination, keyed by its values in option order joined with `/` (e.g. `M / Black`). A missing key or `null` means unlimited; `0` is sold out.<br><br>**Constraints**: `>= 0` |
| `facts` | [`List[Fact]`](/llms-pages/python/models/structures/fact.md) | Optional | Answers to the "buyers will ask" questions in `suggestions.missingFacts`. Each becomes a product detail on the page (replacing one with the same label) and drops off the list.<br><br>**Constraints**: *Maximum Items*: `5` |


# Example

```python
from onethingapi.models.delivery_1 import Delivery1
from onethingapi.models.fact import Fact
from onethingapi.models.kind import Kind
from onethingapi.models.option_value import OptionValue
from onethingapi.models.product_type import ProductType
from onethingapi.models.shop_option import ShopOption
from onethingapi.models.shop_update import ShopUpdate
from onethingapi.models.status import Status

shop_update = ShopUpdate(
    slug='vintageskates',
    status=Status.DRAFT,
    product_type=ProductType.PHYSICAL,
    price=240,
    shipping=15,
    stock=7,
    ship_countries='US,CA',
    delivery=Delivery1.FILE,
    access_url='https://www.miriogames.com/raptor-rush/',
    paypal_email='seller@example.com',
    seller_email='seller@example.com',
    zapier_hook_url='https://hooks.zapier.com/hooks/catch/123456/abcdef/',
    in_gallery=True,
    options=[
        ShopOption(
            name='Size',
            kind=Kind.SIZE,
            values=[
                OptionValue(
                    label='S'
                ),
                OptionValue(
                    label='M'
                ),
                OptionValue(
                    label='L'
                )
            ]
        )
    ],
    option_stock={
        'M / Black': 4,
        'L / Black': 0
    },
    facts=[
        Fact(
            label='Size',
            value='US women\'s 8'
        )
    ]
)
```



