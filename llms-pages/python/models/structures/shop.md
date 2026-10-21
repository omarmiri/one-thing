# Shop

Source: /#/python/x-redirect/JTI0bSUyRlNob3A


# Class Name

`Shop`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `str` | Required | - |
| `slug` | `str` | Required | - |
| `status` | [`Status`](/llms-pages/python/models/enumerations/status.md) | Required | - |
| `product_type` | [`ProductType1`](/llms-pages/python/models/enumerations/product-type-1.md) | Required | - |
| `price_cents` | `int` | Required | - |
| `currency` | `str` | Required | - |
| `shipping_cents` | `int` | Optional | - |
| `ship_countries` | `str` | Optional | - |
| `stock` | `int` | Optional | - |
| `delivery` | [`Delivery1`](/llms-pages/python/models/enumerations/delivery-1.md) | Optional | - |
| `access_url` | `str` | Optional | - |
| `paypal_email` | `str` | Optional | - |
| `seller_email` | `str` | Optional | - |
| `zapier_hook_url` | `str` | Optional | - |
| `in_gallery` | `bool` | Optional | - |
| `photo_blob` | `str` | Optional | Image id for `getImage`. |
| `hero_blob` | `str` | Optional | - |
| `hero_status` | [`HeroStatus`](/llms-pages/python/models/enumerations/hero-status.md) | Optional | - |
| `hero_error` | `str` | Optional | - |
| `ai_source` | [`AiSource`](/llms-pages/python/models/enumerations/ai-source.md) | Optional | - |
| `source_url` | `str` | Optional | - |
| `referral` | [Referral](/llms-pages/python/models/structures/referral.md) \| None | Optional | This is a container for one-of cases. |
| `spec` | [`DesignSpec`](/llms-pages/python/models/structures/design-spec.md) | Required | What Gemini designed. OneThing's templates render it; Gemini never writes HTML. |
| `created_at` | `datetime` | Optional | - |


# Example

```python
from onethingapi.models.delivery_1 import Delivery1
from onethingapi.models.design_spec import DesignSpec
from onethingapi.models.detail import Detail
from onethingapi.models.faq import Faq
from onethingapi.models.fonts import Fonts
from onethingapi.models.layout import Layout
from onethingapi.models.palette import Palette
from onethingapi.models.product_type_1 import ProductType1
from onethingapi.models.product_type_2 import ProductType2
from onethingapi.models.shop import Shop
from onethingapi.models.status import Status

shop = Shop(
    id='id0',
    slug='slug4',
    status=Status.DRAFT,
    product_type=ProductType1.DIGITAL,
    price_cents=240,
    currency='USD',
    spec=DesignSpec(
        product_type=ProductType2.DIGITAL,
        product_name='productName2',
        layout=Layout.MINIMAL,
        palette=Palette(
            background='#14171a',
            surface='#14171a',
            text='#14171a',
            muted='#14171a',
            accent='#14171a',
            accent_text='#14171a'
        ),
        fonts=Fonts(
            heading='heading2',
            body='body6'
        ),
        headline='headline2',
        bullets=[
            'bullets0',
            'bullets1',
            'bullets2'
        ],
        faq=[
            Faq(
                q='q0',
                a='a8'
            )
        ],
        cta_label='ctaLabel6',
        eyebrow='eyebrow6',
        subheadline='subheadline8',
        story='story6',
        details=[
            Detail(
                label='label0',
                value='value2'
            ),
            Detail(
                label='label0',
                value='value2'
            ),
            Detail(
                label='label0',
                value='value2'
            )
        ],
        suggested_price_usd=233.64
    ),
    shipping_cents=148,
    ship_countries='ship_countries4',
    stock=234,
    delivery=Delivery1.FILE,
    access_url='access_url0'
)
```



