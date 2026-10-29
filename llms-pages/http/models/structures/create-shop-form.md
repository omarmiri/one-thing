# Create Shop Form

Source: /#/http/x-redirect/JTI0bSUyRkNyZWF0ZVNob3BGb3Jt

What to make a shop from. Only `source` is required; the AI guesses the rest and the seller corrects it with `updateShop`.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `source` | [`Source`](/llms-pages/http/models/enumerations/source.md) | Required | What the shop starts from: a photo (with an optional description), a product link, or a Channel3 product to recommend. |
| `photo` | `Binary` | Optional | `source=photo`: the product photo, up to 8 MB. |
| `description` | `String` | Optional | `source=photo`: a sentence or two about the product. Required if there is no photo. |
| `url` | `String` | Optional | `source=link`: a product page, or your own app or game page. |
| `productId` | `String` | Optional | `source=channel3`: a product id from `searchProducts`. |
| `slug` | `String` | Optional | The link name you want. If omitted, the AI suggests one. |
| `type` | [`Type`](/llms-pages/http/models/enumerations/type.md) | Optional | `physical` ships, `digital` is a file or an access code, `auto` lets the AI decide.<br><br>**Default**: `auto` |
| `delivery` | [`Delivery`](/llms-pages/http/models/enumerations/delivery.md) | Optional | For digital products. If omitted, the AI guesses. |
| `access_url` | `String` | Optional | Where buyers use an access code. |
| `price` | `Decimal` | Optional | USD. If omitted, the AI suggests a price. |
| `shipping` | `Decimal` | Optional | Physical products: shipping per order, in USD. If omitted, the AI suggests it. |
| `stock` | `Number` | Optional | How many are for sale. Leave out for unlimited. |
| `ship_countries` | `String` | Optional | Physical products: comma-separated ISO country codes to ship to. Empty means anywhere PayPal ships. |
| `paypal_email` | `String` | Optional | The PayPal account that gets paid, if the seller doesn't connect one with `connectPayPal`. |
| `seller_email` | `String` | Optional | Where order notifications go. |
| `digital_file` | `Binary` | Optional | Digital products sold as a file: the file buyers download, up to 25 MB. Can also be added later with `uploadDigitalFile`. |


# Example (as JSON)

```json
{
  "source": "photo",
  "description": "Vintage cream and red quad roller skates with walnut burl heels.",
  "url": "https://one-thing-ash0.onrender.com/vintageskates",
  "productId": "ch3_7f2a9c1e",
  "slug": "vintageskates",
  "type": "auto",
  "delivery": "file",
  "access_url": "https://www.miriogames.com/raptor-rush/",
  "price": 240,
  "shipping": 15,
  "stock": 7,
  "ship_countries": "US",
  "paypal_email": "seller@example.com",
  "seller_email": "seller@example.com"
}
```



