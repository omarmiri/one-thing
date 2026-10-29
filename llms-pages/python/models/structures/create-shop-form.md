# Create Shop Form

Source: /#/python/x-redirect/JTI0bSUyRkNyZWF0ZVNob3BGb3Jt

What to make a shop from. Only `source` is required; the AI guesses the rest and the seller corrects it with `updateShop`.


# Class Name

`CreateShopForm`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `source` | [`Source`](/llms-pages/python/models/enumerations/source.md) | Required | What the shop starts from: a photo (with an optional description), a product link, or a Channel3 product to recommend. |
| `photo` | `binary` | Optional | `source=photo`: the product photo, up to 8 MB. |
| `description` | `str` | Optional | `source=photo`: a sentence or two about the product. Required if there is no photo. |
| `url` | `str` | Optional | `source=link`: a product page, or your own app or game page. |
| `product_id` | `str` | Optional | `source=channel3`: a product id from `searchProducts`. |
| `slug` | `str` | Optional | The link name you want. If omitted, the AI suggests one. |
| `mtype` | [`Type`](/llms-pages/python/models/enumerations/type.md) | Optional | `physical` ships, `digital` is a file or an access code, `auto` lets the AI decide.<br><br>**Default**: `"auto"` |
| `delivery` | [`Delivery`](/llms-pages/python/models/enumerations/delivery.md) | Optional | For digital products. If omitted, the AI guesses. |
| `access_url` | `str` | Optional | Where buyers use an access code. |
| `price` | `float` | Optional | USD. If omitted, the AI suggests a price. |
| `shipping` | `float` | Optional | Physical products: shipping per order, in USD. If omitted, the AI suggests it. |
| `stock` | `int` | Optional | How many are for sale. Leave out for unlimited. |
| `ship_countries` | `str` | Optional | Physical products: comma-separated ISO country codes to ship to. Empty means anywhere PayPal ships. |
| `paypal_email` | `str` | Optional | The PayPal account that gets paid, if the seller doesn't connect one with `connectPayPal`. |
| `seller_email` | `str` | Optional | Where order notifications go. |
| `digital_file` | `binary` | Optional | Digital products sold as a file: the file buyers download, up to 25 MB. Can also be added later with `uploadDigitalFile`. |


# Example

```python
from onethingapi.models.create_shop_form import CreateShopForm
from onethingapi.models.delivery import Delivery
from onethingapi.models.mtype import Type
from onethingapi.models.source import Source

create_shop_form = CreateShopForm(
    source=Source.PHOTO,
    description='Vintage cream and red quad roller skates with walnut burl heels.',
    url='https://one-thing-ash0.onrender.com/vintageskates',
    product_id='ch3_7f2a9c1e',
    slug='vintageskates',
    mtype=Type.AUTO,
    delivery=Delivery.FILE,
    access_url='https://www.miriogames.com/raptor-rush/',
    price=240,
    shipping=15,
    stock=7,
    ship_countries='US',
    paypal_email='seller@example.com',
    seller_email='seller@example.com'
)
```



