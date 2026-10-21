# Api Shops Refine Response

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyMFJlZmluZSUyNTIwUmVzcG9uc2U


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
    )
)
```



