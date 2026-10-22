# Create Shop

Source: /#/http/x-redirect/JTI0ZSUyRlNob3BzJTJGY3JlYXRlU2hvcA

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

**Platforms:** sent with a platform API key, the shop belongs to the key's account, so the
key can manage it from then on (no need to keep the admin token). It's made for one of the
platform's sellers, so it inherits nothing from the account: set `paypal_email` or call
`connectPayPal` for that seller.

```http
POST /api/shops
```


# Authentication

This endpoint requires [PlatformKey](/llms-pages/http/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `source` | [`Source`](/llms-pages/http/models/enumerations/source.md) | Form, Required | - |
| `photo` | `File` | Form, Optional | `source=photo`: the product photo, up to 8 MB. |
| `description` | `String` | Form, Optional | `source=photo`: a sentence or two about the product. Required if there is no photo. |
| `url` | `String` | Form, Optional | `source=link`: a product page, or your own app or game page. |
| `productId` | `String` | Form, Optional | `source=channel3`: a product id from `searchProducts`. |
| `slug` | `String` | Form, Optional | The link name you want. If omitted, the AI suggests one. |
| `type` | [`Type`](/llms-pages/http/models/enumerations/type.md) | Form, Optional | **Default**: `auto` |
| `delivery` | [`Delivery`](/llms-pages/http/models/enumerations/delivery.md) | Form, Optional | For digital products. If omitted, the AI guesses. |
| `access_url` | `String` | Form, Optional | Where buyers use an access code. |
| `price` | `Decimal` | Form, Optional | USD. If omitted, the AI suggests a price. |
| `shipping` | `Decimal` | Form, Optional | - |
| `stock` | `Number` | Form, Optional | - |
| `ship_countries` | `String` | Form, Optional | - |
| `paypal_email` | `String` | Form, Optional | - |
| `seller_email` | `String` | Form, Optional | - |
| `digital_file` | `File` | Form, Optional | - |


# Response Type

**200**: Draft created.

[`Created Shop`](/llms-pages/http/models/structures/created-shop.md)


# Example Usage

```bash
curl -X POST \
  --url 'https://one-thing-ash0.onrender.com/api/shops'  \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer AccessToken'\
  -F 'source=photo' \
  -F 'type=auto'
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |
| 409 | Taken or unavailable (a link name, or a sold-out product). | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |



