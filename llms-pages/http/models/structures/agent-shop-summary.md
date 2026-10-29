# Agent Shop Summary

Source: /#/http/x-redirect/JTI0bSUyRkFnZW50U2hvcFN1bW1hcnk


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `shop` | `String` | Required | The link name, for `getAgentProduct` and the MCP tools. |
| `name` | `String` | Required | - |
| `kind` | [`Kind 1`](/llms-pages/http/models/enumerations/kind-1.md) | Required | - |
| `headline` | `String` | Required | - |
| `price` | `String` | Required | The price label, e.g. `$2.99`; null for recommendations. |
| `image` | `String` | Required | The cover photo's URL (WebP; the retailer's image for a recommendation), or null when there's none. |
| `url` | `String` | Required | The shop page. |


# Example (as JSON)

```json
{
  "shop": "shop8",
  "name": "name8",
  "kind": "physical",
  "headline": "headline2",
  "price": "price4",
  "image": "image8",
  "url": "url2"
}
```



