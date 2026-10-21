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
    shipping=205.88
)
```



