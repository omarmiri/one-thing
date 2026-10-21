# Create Shop Form

Source: /#/http/x-redirect/JTI0bSUyRkNyZWF0ZVNob3BGb3Jt


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `source` | [`Source`](/llms-pages/http/models/enumerations/source.md) | Required | - |
| `photo` | `Binary` | Optional | `source=photo`: the product photo, up to 8 MB. |
| `description` | `String` | Optional | `source=photo`: a sentence or two about the product. Required if there is no photo. |
| `url` | `String` | Optional | `source=link`: a product page, or your own app or game page. |
| `productId` | `String` | Optional | `source=channel3`: a product id from `searchProducts`. |
| `slug` | `String` | Optional | The link name you want. If omitted, the AI suggests one. |
| `type` | [`Type`](/llms-pages/http/models/enumerations/type.md) | Optional | **Default**: `auto` |
| `delivery` | [`Delivery`](/llms-pages/http/models/enumerations/delivery.md) | Optional | For digital products. If omitted, the AI guesses. |
| `access_url` | `String` | Optional | Where buyers use an access code. |
| `price` | `Decimal` | Optional | USD. If omitted, the AI suggests a price. |
| `shipping` | `Decimal` | Optional | - |
| `stock` | `Number` | Optional | - |
| `ship_countries` | `String` | Optional | - |
| `paypal_email` | `String` | Optional | - |
| `seller_email` | `String` | Optional | - |
| `digital_file` | `Binary` | Optional | - |


# Example (as JSON)

```json
{
  "source": "channel3",
  "type": "auto",
  "ship_countries": "US",
  "photo": "data:text/plain;name=dummy_file;base64,",
  "description": "description0",
  "url": "url4",
  "productId": "productId4",
  "slug": "slug4"
}
```



