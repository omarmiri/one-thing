# Shop Update

Source: /#/python/x-redirect/JTI0bSUyRlNob3BVcGRhdGU


# Class Name

`ShopUpdate`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Optional | - |
| `status` | [`Status`](/llms-pages/python/models/enumerations/status.md) | Optional | - |
| `product_type` | [`ProductType`](/llms-pages/python/models/enumerations/product-type.md) | Optional | `referral` only for shops created from Channel3. |
| `price` | `float` | Optional | **Constraints**: `>= 0.5`, `<= 10000` |
| `shipping` | `float` | Optional | **Constraints**: `>= 0`, `<= 500` |
| `stock` | `int` | Optional | **Constraints**: `>= 0` |
| `ship_countries` | `str` | Optional | - |
| `delivery` | [`Delivery1`](/llms-pages/python/models/enumerations/delivery-1.md) | Optional | - |
| `access_url` | `str` | Optional | - |
| `paypal_email` | `str` | Optional | - |
| `seller_email` | `str` | Optional | - |
| `zapier_hook_url` | `str` | Optional | - |
| `in_gallery` | `bool` | Optional | Feature the shop at `/gallery` while it's live. Off by default. |
| `options` | [`List[ShopOption]`](/llms-pages/python/models/structures/shop-option.md) | Optional | What the buyer picks (physical products only), replacing the current options; `[]` removes them. With options, stock is counted per combination in `option_stock` and the shop's own `stock` is cleared. At most 60 combinations.<br><br>**Constraints**: *Maximum Items*: `3` |
| `option_stock` | `Dict[str, int]` | Optional | Stock per combination, keyed by its values in option order joined with `/` (e.g. `M / Black`). A missing key or `null` means unlimited; `0` is sold out.<br><br>**Constraints**: `>= 0` |
| `facts` | [`List[Fact]`](/llms-pages/python/models/structures/fact.md) | Optional | Answers to the "buyers will ask" questions in `suggestions.missingFacts`. Each becomes a product detail on the page (replacing one with the same label) and drops off the list.<br><br>**Constraints**: *Maximum Items*: `5` |


# Example

```python
from onethingapi.models.product_type import ProductType
from onethingapi.models.shop_update import ShopUpdate
from onethingapi.models.status import Status

shop_update = ShopUpdate(
    slug='slug2',
    status=Status.DRAFT,
    product_type=ProductType.DIGITAL,
    price=171.58,
    shipping=205.88,
    option_stock={
        'M / Black': 4,
        'L / Black': 0
    }
)
```



