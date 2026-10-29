# Api Shops Match Photos Request

Source: /#/http/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyME1hdGNoJTI1MjBQaG90b3MlMjUyMFJlcXVlc3Q

The colours to find photos for.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `colors` | [`array<Color>`](/llms-pages/http/models/structures/color.md) | Required | The colour option's values.<br><br>**Constraints**: *Minimum Items*: `1`, *Maximum Items*: `12` |


# Example (as JSON)

```json
{
  "colors": [
    {
      "label": "Ice Blue",
      "hex": "#9fd3e6"
    }
  ]
}
```



