# Api Platform Shops Response

Source: /#/http/x-redirect/JTI0bSUyRkFwaSUyNTIwUGxhdGZvcm0lMjUyMFNob3BzJTI1MjBSZXNwb25zZQ

The account's shops.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `shops` | [`array<Platform Shop>`](/llms-pages/http/models/structures/platform-shop.md) | Required | Shops, newest first. |


# Example (as JSON)

```json
{
  "shops": [
    {
      "slug": "vintageskates",
      "status": "draft",
      "name": "Vintage Cream and Red Roller Skates",
      "headline": "Classic quad skates crafted with walnut burl heels",
      "product_type": "physical",
      "price": {
        "amount": 240.0,
        "currency": "USD",
        "label": "$240.00"
      },
      "url": "https://one-thing-ash0.onrender.com/vintageskates",
      "cover": "https://one-thing-ash0.onrender.com/api/blobs/LFRvGuTU3D8i334X",
      "paypal_connected": true,
      "sales": 12,
      "created_at": "2026-10-22T02:41:37Z"
    }
  ]
}
```



