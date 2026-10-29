# Api Orders Request

Source: /#/http/x-redirect/JTI0bSUyRkFwaSUyNTIwT3JkZXJzJTI1MjBSZXF1ZXN0

The shop to buy from and the buyer's pick.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Required | The shop's link name. |
| `options` | `map<String>` | Optional | The buyer's pick, one value per option, keyed by option name. |


# Example (as JSON)

```json
{
  "slug": "vintageskates",
  "options": {
    "Size": "M",
    "Color": "Black"
  }
}
```



