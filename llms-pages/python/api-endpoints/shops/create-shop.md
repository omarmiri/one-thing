# Create Shop

Source: /#/python/x-redirect/JTI0ZSUyRlNob3BzJTJGY3JlYXRlU2hvcA

Starts a draft shop from one of three sources. Gemini designs the page and guesses the
setup; check it with `getShop`, adjust with `updateShop`, then go live.

Sent with a session cookie from `signIn`, the shop belongs to that account, which also
becomes its seller email (and PayPal email, after Log in with PayPal) unless you give one.

- `source=photo`: a `photo` and/or a `description` of your own product.
- `source=link`: a `url`. If Channel3 recognises it as a store's product page, the shop
  becomes a recommendation (`product_type: referral`); otherwise the page is read and you
  sell the product yourself with PayPal.
- `source=channel3`: a `productId` from `searchProducts` (a recommendation).

Takes 15–40 seconds. Hero art, if available, is generated afterwards (`hero_status`).

:information_source: **Note** This endpoint does not require authentication.

```python
def create_shop(self,
               source,
               photo=None,
               description=None,
               url=None,
               product_id=None,
               slug=None,
               mtype="auto",
               delivery=None,
               access_url=None,
               price=None,
               shipping=None,
               stock=None,
               ship_countries=None,
               paypal_email=None,
               seller_email=None,
               digital_file=None)
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `source` | [`Source`](/llms-pages/python/models/enumerations/source.md) | Form, Required | - |
| `photo` | `typing.BinaryIO` | Form, Optional | `source=photo`: the product photo, up to 8 MB. |
| `description` | `str` | Form, Optional | `source=photo`: a sentence or two about the product. Required if there is no photo. |
| `url` | `str` | Form, Optional | `source=link`: a product page, or your own app or game page. |
| `product_id` | `str` | Form, Optional | `source=channel3`: a product id from `searchProducts`. |
| `slug` | `str` | Form, Optional | The link name you want. If omitted, the AI suggests one. |
| `mtype` | [`Type`](/llms-pages/python/models/enumerations/type.md) | Form, Optional | **Default**: `"auto"` |
| `delivery` | [`Delivery`](/llms-pages/python/models/enumerations/delivery.md) | Form, Optional | For digital products. If omitted, the AI guesses. |
| `access_url` | `str` | Form, Optional | Where buyers use an access code. |
| `price` | `float` | Form, Optional | USD. If omitted, the AI suggests a price. |
| `shipping` | `float` | Form, Optional | - |
| `stock` | `int` | Form, Optional | - |
| `ship_countries` | `str` | Form, Optional | - |
| `paypal_email` | `str` | Form, Optional | - |
| `seller_email` | `str` | Form, Optional | - |
| `digital_file` | `typing.BinaryIO` | Form, Optional | - |


# Response Type

**200**: Draft created.

[`CreatedShop`](/llms-pages/python/models/structures/created-shop.md)


# Example Usage

```python
source = Source.PHOTO

mtype = Type.AUTO

result = shops_api.create_shop(
    source,
    mtype=mtype
)
print(result)
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 409 | Taken or unavailable (a link name, or a sold-out product). | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |



