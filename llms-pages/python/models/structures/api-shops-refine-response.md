# Api Shops Refine Response

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyMFJlZmluZSUyNTIwUmVzcG9uc2U

The redesigned page.


# Class Name

`ApiShopsRefineResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `spec` | [`DesignSpec`](/llms-pages/python/models/structures/design-spec.md) | Required | What Gemini designed. OneThing's templates render it; Gemini never writes HTML. |


# Example

```python
from onethingapi.models.api_shops_refine_response import ApiShopsRefineResponse
from onethingapi.models.design_spec import DesignSpec
from onethingapi.models.detail import Detail
from onethingapi.models.faq import Faq
from onethingapi.models.fonts import Fonts
from onethingapi.models.layout import Layout
from onethingapi.models.palette import Palette
from onethingapi.models.product_type_2 import ProductType2

api_shops_refine_response = ApiShopsRefineResponse(
    spec=DesignSpec(
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
)
```



