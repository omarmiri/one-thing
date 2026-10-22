# Shop Update

Source: /#/http/x-redirect/JTI0bSUyRlNob3BVcGRhdGU


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Optional | - |
| `status` | [`Status`](/llms-pages/http/models/enumerations/status.md) | Optional | - |
| `product_type` | [`Product Type`](/llms-pages/http/models/enumerations/product-type.md) | Optional | `referral` only for shops created from Channel3. |
| `price` | `Decimal` | Optional | **Constraints**: `>= 0.5`, `<= 10000` |
| `shipping` | `Decimal` | Optional | **Constraints**: `>= 0`, `<= 500` |
| `stock` | `Number` | Optional | **Constraints**: `>= 0` |
| `ship_countries` | `String` | Optional | - |
| `delivery` | [`Delivery 1`](/llms-pages/http/models/enumerations/delivery-1.md) | Optional | - |
| `access_url` | `String` | Optional | - |
| `paypal_email` | `String` | Optional | - |
| `seller_email` | `String` | Optional | - |
| `zapier_hook_url` | `String` | Optional | - |
| `in_gallery` | `Boolean` | Optional | Feature the shop at `/gallery` while it's live. Off by default. |
| `options` | [`array<Shop Option>`](/llms-pages/http/models/structures/shop-option.md) | Optional | What the buyer picks (physical products only), replacing the current options; `[]` removes them. With options, stock is counted per combination in `option_stock` and the shop's own `stock` is cleared. At most 60 combinations.<br><br>**Constraints**: *Maximum Items*: `3` |
| `option_stock` | `map<Number>` | Optional | Stock per combination, keyed by its values in option order joined with `/` (e.g. `M / Black`). A missing key or `null` means unlimited; `0` is sold out.<br><br>**Constraints**: `>= 0` |
| `facts` | [`array<Fact>`](/llms-pages/http/models/structures/fact.md) | Optional | Answers to the "buyers will ask" questions in `suggestions.missingFacts`. Each becomes a product detail on the page (replacing one with the same label) and drops off the list.<br><br>**Constraints**: *Maximum Items*: `5` |


# Example (as JSON)

```json
{
  "option_stock": {
    "M / Black": 4,
    "L / Black": 0
  },
  "slug": "slug8",
  "status": "draft",
  "product_type": "physical",
  "price": 133.24,
  "shipping": 244.22
}
```



