# Option 1

Source: /#/http/x-redirect/JTI0bSUyRk9wdGlvbjE

One option and its values.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `name` | `String` | Required | The option's name, which is also its query parameter on `order_url`. |
| `values` | `array<String>` | Required | The values the buyer can pick. |


# Example (as JSON)

```json
{
  "name": "Size",
  "values": [
    "7",
    "8",
    "9"
  ]
}
```



