# Option Value

Source: /#/http/x-redirect/JTI0bSUyRk9wdGlvblZhbHVl

One value of an option.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `label` | `String` | Required | What the buyer sees and picks.<br><br>**Constraints**: *Maximum Length*: `30` |
| `hex` | `String` | Optional | A colour as `#rrggbb`.<br><br>**Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |
| `photo` | `String` | Optional | Colours: the shop photo (id) that shows this colour. See `matchColorPhotos`. |


# Example (as JSON)

```json
{
  "label": "M",
  "hex": "#14171a",
  "photo": "zrySajNyao6_j11x"
}
```



