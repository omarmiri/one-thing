# Create Shop Form

Source: /#/python/x-redirect/JTI0bSUyRkNyZWF0ZVNob3BGb3Jt


# Class Name

`CreateShopForm`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `source` | [`Source`](/llms-pages/python/models/enumerations/source.md) | Required | - |
| `photo` | `binary` | Optional | `source=photo`: the product photo, up to 8 MB. |
| `description` | `str` | Optional | `source=photo`: a sentence or two about the product. Required if there is no photo. |
| `url` | `str` | Optional | `source=link`: a product page, or your own app or game page. |
| `product_id` | `str` | Optional | `source=channel3`: a product id from `searchProducts`. |
| `slug` | `str` | Optional | The link name you want. If omitted, the AI suggests one. |
| `mtype` | [`Type`](/llms-pages/python/models/enumerations/type.md) | Optional | **Default**: `"auto"` |
| `delivery` | [`Delivery`](/llms-pages/python/models/enumerations/delivery.md) | Optional | For digital products. If omitted, the AI guesses. |
| `access_url` | `str` | Optional | Where buyers use an access code. |
| `price` | `float` | Optional | USD. If omitted, the AI suggests a price. |
| `shipping` | `float` | Optional | - |
| `stock` | `int` | Optional | - |
| `ship_countries` | `str` | Optional | - |
| `paypal_email` | `str` | Optional | - |
| `seller_email` | `str` | Optional | - |
| `digital_file` | `binary` | Optional | - |


# Example

```python
from onethingapi.models.create_shop_form import CreateShopForm
from onethingapi.models.mtype import Type
from onethingapi.models.source import Source

create_shop_form = CreateShopForm(
    source=Source.CHANNEL3,
    photo=None,
    description='description0',
    url='url4',
    product_id='productId4',
    slug='slug4',
    mtype=Type.AUTO,
    ship_countries='US'
)
```



