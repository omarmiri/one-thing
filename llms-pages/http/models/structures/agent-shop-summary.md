# Agent Shop Summary

Source: /#/http/x-redirect/JTI0bSUyRkFnZW50U2hvcFN1bW1hcnk

A shop in search results.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `shop` | `String` | Required | The link name, for `getAgentProduct` and the MCP tools. |
| `name` | `String` | Required | The product's name. |
| `kind` | [`Kind 2`](/llms-pages/http/models/enumerations/kind-2.md) | Required | `physical`, `digital` or `referral`. |
| `headline` | `String` | Required | The shop's one-line pitch. |
| `price` | `String` | Required | The price label, e.g. `$2.99`; null for recommendations. |
| `image` | `String` | Required | The cover photo's URL (WebP; the retailer's image for a recommendation), or null when there's none. |
| `url` | `String` | Required | The shop page. |


# Example (as JSON)

```json
{
  "shop": "vintageskates",
  "name": "Vintage Cream and Red Roller Skates",
  "kind": "physical",
  "headline": "Classic quad skates crafted with walnut burl heels",
  "price": "$240.00",
  "image": "https://one-thing-ash0.onrender.com/api/blobs/LFRvGuTU3D8i334X",
  "url": "https://one-thing-ash0.onrender.com/vintageskates"
}
```



