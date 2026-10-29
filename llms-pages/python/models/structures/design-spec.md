# Design Spec

Source: /#/python/x-redirect/JTI0bSUyRkRlc2lnblNwZWM

What Gemini designed. OneThing's templates render it; Gemini never writes HTML.


# Class Name

`DesignSpec`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `product_type` | [`ProductType2`](/llms-pages/python/models/enumerations/product-type-2.md) | Required | What the AI decided the product is. |
| `product_name` | `str` | Required | The product's name. |
| `layout` | [`Layout`](/llms-pages/python/models/enumerations/layout.md) | Required | The page template: `bold-hero` (image first, punchy), `editorial` (magazine), `minimal` (quiet, lots of space) or `playful`. |
| `palette` | [`Palette`](/llms-pages/python/models/structures/palette.md) | Required | The page colours, taken from the photo. Text colours are checked for contrast. |
| `fonts` | [`Fonts`](/llms-pages/python/models/structures/fonts.md) | Required | Google Fonts for the page. |
| `eyebrow` | `str` | Optional | A short label above the headline. |
| `headline` | `str` | Required | The page's main headline. |
| `subheadline` | `str` | Optional | A line under the headline. |
| `story` | `str` | Optional | A short paragraph about the product. |
| `bullets` | `List[str]` | Required | Short selling points. |
| `details` | [`List[Detail]`](/llms-pages/python/models/structures/detail.md) | Optional | Product facts shown on the page. |
| `faq` | [`List[Faq]`](/llms-pages/python/models/structures/faq.md) | Required | Questions buyers will ask, with answers. |
| `cta_label` | `str` | Required | The buy button's text. |
| `suggested_price_usd` | `float` | Optional | The AI's price suggestion, in USD. |
| `suggested_shipping_usd` | `float` | Optional | The AI's shipping suggestion, in USD. |
| `image_alt` | `str` | Optional | Alt text for the product photo. |
| `hero_prompt` | `str` | Optional | The prompt used to generate hero art for the page. |


# Example

```python
from onethingapi.models.design_spec import DesignSpec
from onethingapi.models.detail import Detail
from onethingapi.models.faq import Faq
from onethingapi.models.fonts import Fonts
from onethingapi.models.layout import Layout
from onethingapi.models.palette import Palette
from onethingapi.models.product_type_2 import ProductType2

design_spec = DesignSpec(
    product_type=ProductType2.PHYSICAL,
    product_name='Vintage Cream and Red Roller Skates',
    layout=Layout.BOLDHERO,
    palette=Palette(
        background='#f7f1e8',
        surface='#ffffff',
        text='#1f1a17',
        muted='#6b625b',
        accent='#b3262d',
        accent_text='#ffffff'
    ),
    fonts=Fonts(
        heading='Playfair Display',
        body='Inter'
    ),
    headline='Classic quad skates crafted with walnut burl heels',
    bullets=[
        'Walnut burl heels',
        'Restored vintage leather'
    ],
    faq=[
        Faq(
            q='Are these suitable for outdoor skating?',
            a='Yes, on indoor rink floors and paved outdoor paths.'
        )
    ],
    cta_label='Buy the skates',
    eyebrow='One pair, restored',
    subheadline='A vintage pair of skates with cream leather, bold red trim and quad wheels.',
    story='Each pair combines soft cream leather with distinct red accents and a sculpted walnut burl heel base.',
    details=[
        Detail(
            label='Material',
            value='Leather upper, walnut burl heel, rubber wheels'
        )
    ],
    suggested_price_usd=240,
    suggested_shipping_usd=15,
    image_alt='Cream leather quad roller skates with red trim',
    hero_prompt='Cream roller skates on a sunlit boardwalk, in warm cream and red tones'
)
```



