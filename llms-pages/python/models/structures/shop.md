# Shop

Source: /#/python/x-redirect/JTI0bSUyRlNob3A

A shop, as its seller sees it.


# Class Name

`Shop`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `str` | Required | OneThing's internal shop id. |
| `slug` | `str` | Required | The shop's link name. |
| `status` | [`Status1`](/llms-pages/python/models/enumerations/status-1.md) | Required | `draft` until the seller goes live; only `live` shops take orders. |
| `product_type` | [`ProductType1`](/llms-pages/python/models/enumerations/product-type-1.md) | Required | `physical` ships, `digital` downloads or unlocks, `referral` recommends a Channel3 product. |
| `price_cents` | `int` | Required | The price in cents. |
| `currency` | `str` | Required | ISO 4217 currency code. |
| `shipping_cents` | `int` | Optional | Shipping per order, in cents. |
| `ship_countries` | `str` | Optional | Comma-separated ISO country codes; null or empty means anywhere PayPal ships. |
| `stock` | `int` | Optional | How many are left; null for unlimited. With options, see `option_stock`. |
| `delivery` | [`Delivery2`](/llms-pages/python/models/enumerations/delivery-2.md) | Optional | Digital products: `file` (a download) or `access_code` (a code that unlocks an app or game). |
| `access_url` | `str` | Optional | Access-code products: where buyers enter their code. |
| `paypal_email` | `str` | Optional | The PayPal account paid when no account is connected. |
| `seller_email` | `str` | Optional | Where order notifications go. |
| `paypal_merchant_id` | `str` | Optional | The connected PayPal account (`connectPayPal`). Sales go here when it can receive payments. |
| `paypal_status` | [PayPalStatus](/llms-pages/python/models/structures/pay-pal-status.md) \| None | Optional | This is a container for one-of cases. |
| `zapier_hook_url` | `str` | Optional | A Zapier Catch Hook that gets an `OrderEvent` for each paid, shipped or refunded order. |
| `in_gallery` | `bool` | Optional | Whether the shop is featured at `/gallery` while live. |
| `account_id` | `str` | Optional | The seller account that owns the shop, if it was made while signed in. |
| `options` | [`List[ShopOption]`](/llms-pages/python/models/structures/shop-option.md) | Optional | What the buyer picks, such as size or colour. |
| `option_stock` | `Dict[str, int]` | Optional | Stock per combination, keyed by its values in option order joined with `/` (e.g. `M / Black`). A missing key or `null` means unlimited; `0` is sold out.<br><br>**Constraints**: `>= 0` |
| `suggestions` | [Suggestions](/llms-pages/python/models/structures/suggestions.md) \| None | Optional | This is a container for one-of cases. |
| `photo_blob` | `str` | Optional | Image id for `getImage`. The cover photo. |
| `gallery_blobs` | `List[str]` | Optional | The other photos, in order. |
| `hero_blob` | `str` | Optional | Image id of the AI hero art, when there is one. |
| `hero_status` | [`HeroStatus`](/llms-pages/python/models/enumerations/hero-status.md) | Optional | Hero art: `pending` while generating, then `ready` or `failed`; `none` if not requested. |
| `hero_error` | `str` | Optional | Why hero art failed, when it did. |
| `ai_source` | [`AiSource`](/llms-pages/python/models/enumerations/ai-source.md) | Optional | Who designed the page: `gemini`, or `fallback` when Gemini wasn't available and a plain template was used. |
| `source_url` | `str` | Optional | The product link the shop was made from, if any. |
| `referral` | [Referral](/llms-pages/python/models/structures/referral.md) \| None | Optional | This is a container for one-of cases. |
| `spec` | [`DesignSpec`](/llms-pages/python/models/structures/design-spec.md) | Required | What Gemini designed. OneThing's templates render it; Gemini never writes HTML. |
| `created_at` | `datetime` | Optional | When the shop was made. |


# Example

```python
import dateutil.parser

from onethingapi.models.ai_source import AiSource
from onethingapi.models.delivery_2 import Delivery2
from onethingapi.models.design_spec import DesignSpec
from onethingapi.models.detail import Detail
from onethingapi.models.faq import Faq
from onethingapi.models.fonts import Fonts
from onethingapi.models.hero_status import HeroStatus
from onethingapi.models.kind import Kind
from onethingapi.models.layout import Layout
from onethingapi.models.missing_fact import MissingFact
from onethingapi.models.offer import Offer
from onethingapi.models.option import Option
from onethingapi.models.option_value import OptionValue
from onethingapi.models.palette import Palette
from onethingapi.models.pay_pal_status import PayPalStatus
from onethingapi.models.product_type_1 import ProductType1
from onethingapi.models.product_type_2 import ProductType2
from onethingapi.models.referral import Referral
from onethingapi.models.shop import Shop
from onethingapi.models.shop_option import ShopOption
from onethingapi.models.status_1 import Status1
from onethingapi.models.suggestions import Suggestions

shop = Shop(
    id='shp_8Hc2LmQ4',
    slug='vintageskates',
    status=Status1.DRAFT,
    product_type=ProductType1.PHYSICAL,
    price_cents=24000,
    currency='USD',
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
    ),
    shipping_cents=1500,
    ship_countries='US,CA',
    stock=7,
    delivery=Delivery2.FILE,
    access_url='https://www.miriogames.com/raptor-rush/',
    paypal_email='seller@example.com',
    seller_email='seller@example.com',
    paypal_merchant_id='7MZJ4QXN8K2LA',
    paypal_status=PayPalStatus(
        receivable=True,
        email_confirmed=True,
        checked_at=dateutil.parser.parse('2026-10-22T02:41:37Z')
    ),
    zapier_hook_url='https://hooks.zapier.com/hooks/catch/123456/abcdef/',
    in_gallery=True,
    account_id='acc_Vq3nN8cT0bLx2YwE',
    options=[
        ShopOption(
            name='Size',
            kind=Kind.SIZE,
            values=[
                OptionValue(
                    label='S',
                    hex='hex4',
                    photo='photo6'
                ),
                OptionValue(
                    label='M',
                    hex='hex4',
                    photo='photo6'
                ),
                OptionValue(
                    label='L',
                    hex='hex4',
                    photo='photo6'
                )
            ]
        )
    ],
    option_stock={
        'M / Black': 4,
        'L / Black': 0
    },
    suggestions=Suggestions(
        one_of_a_kind=False,
        options=[
            Option(
                name='Size',
                kind=Kind.SIZE,
                values=[
                    OptionValue(
                        label='S',
                        hex='hex4',
                        photo='photo6'
                    ),
                    OptionValue(
                        label='M',
                        hex='hex4',
                        photo='photo6'
                    ),
                    OptionValue(
                        label='L',
                        hex='hex4',
                        photo='photo6'
                    )
                ],
                from_seller=False
            )
        ],
        missing_facts=[
            MissingFact(
                label='Size',
                question='What size are the skates?',
                placeholder='US women\'s 8'
            )
        ]
    ),
    photo_blob='LFRvGuTU3D8i334X',
    gallery_blobs=[
        'zrySajNyao6_j11x',
        'SuqcgNv64HWN8H6e'
    ],
    hero_blob='Hn2Kd8sQp4LmZ0vX',
    hero_status=HeroStatus.NONE,
    hero_error='No image model on this key returned an image.',
    ai_source=AiSource.GEMINI,
    source_url='https://example.com/products/roller-skates',
    referral=Referral(
        product_id='ch3_7f2a9c1e',
        title='Trail Running Vest 5L',
        offers=[
            Offer(
                domain='rei.com',
                url='https://buy.trychannel3.com/r/abc123',
                price=240,
                currency='USD',
                in_stock=True,
                commission=0.08
            )
        ],
        brand='Salomon',
        image='https://images.example.com/vest.jpg'
    ),
    created_at=dateutil.parser.parse('2026-10-22T02:41:37Z')
)
```



