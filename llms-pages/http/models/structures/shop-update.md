# Shop Update

Source: /#/http/x-redirect/JTI0bSUyRlNob3BVcGRhdGU

The fields to change. Anything left out stays as it is.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Optional | A new link name. The old one keeps redirecting. |
| `status` | [`Status`](/llms-pages/http/models/enumerations/status.md) | Optional | `live` publishes the shop; `draft` takes it down. |
| `product_type` | [`Product Type`](/llms-pages/http/models/enumerations/product-type.md) | Optional | `referral` only for shops created from Channel3. |
| `price` | `Decimal` | Optional | The price in USD.<br><br>**Constraints**: `>= 0.5`, `<= 10000` |
| `shipping` | `Decimal` | Optional | Shipping per order, in USD.<br><br>**Constraints**: `>= 0`, `<= 500` |
| `stock` | `Number` | Optional | How many are for sale; null for unlimited.<br><br>**Constraints**: `>= 0` |
| `ship_countries` | `String` | Optional | Comma-separated ISO country codes; null or empty means anywhere PayPal ships. |
| `delivery` | [`Delivery 1`](/llms-pages/http/models/enumerations/delivery-1.md) | Optional | Digital products: `file` or `access_code`. |
| `access_url` | `String` | Optional | Access-code products: where buyers enter their code. |
| `paypal_email` | `String` | Optional | The PayPal account paid when no account is connected. |
| `seller_email` | `String` | Optional | Where order notifications go. |
| `zapier_hook_url` | `String` | Optional | A Zapier Catch Hook for order events; null removes it. |
| `in_gallery` | `Boolean` | Optional | Feature the shop at `/gallery` while it's live. Off by default. |
| `options` | [`array<Shop Option>`](/llms-pages/http/models/structures/shop-option.md) | Optional | What the buyer picks (physical products only), replacing the current options; `[]` removes them. With options, stock is counted per combination in `option_stock` and the shop's own `stock` is cleared. At most 60 combinations.<br><br>**Constraints**: *Maximum Items*: `3` |
| `option_stock` | `map<Number>` | Optional | Stock per combination, keyed by its values in option order joined with `/` (e.g. `M / Black`). A missing key or `null` means unlimited; `0` is sold out.<br><br>**Constraints**: `>= 0` |
| `facts` | [`array<Fact>`](/llms-pages/http/models/structures/fact.md) | Optional | Answers to the "buyers will ask" questions in `suggestions.missingFacts`. Each becomes a product detail on the page (replacing one with the same label) and drops off the list.<br><br>**Constraints**: *Maximum Items*: `5` |


# Example (as JSON)

```json
{
  "slug": "vintageskates",
  "status": "draft",
  "product_type": "physical",
  "price": 240,
  "shipping": 15,
  "stock": 7,
  "ship_countries": "US,CA",
  "delivery": "file",
  "access_url": "https://www.miriogames.com/raptor-rush/",
  "paypal_email": "seller@example.com",
  "seller_email": "seller@example.com",
  "zapier_hook_url": "https://hooks.zapier.com/hooks/catch/123456/abcdef/",
  "in_gallery": true,
  "options": [
    {
      "name": "Size",
      "kind": "size",
      "values": [
        {
          "label": "S"
        },
        {
          "label": "M"
        },
        {
          "label": "L"
        }
      ]
    }
  ],
  "option_stock": {
    "M / Black": 4,
    "L / Black": 0
  },
  "facts": [
    {
      "label": "Size",
      "value": "US women's 8"
    }
  ]
}
```



