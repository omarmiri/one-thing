# Api Slugs Check Response

Source: /#/http/x-redirect/JTI0bSUyRkFwaSUyNTIwU2x1Z3MlMjUyMENoZWNrJTI1MjBSZXNwb25zZQ

Whether the link name can be used.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Required | The name, normalised. |
| `available` | `Boolean` | Required | True if no other shop has it and it isn't reserved. |
| `problem` | `String` | Optional | Why not, when unavailable. |


# Example (as JSON)

```json
{
  "slug": "vintageskates",
  "available": true,
  "problem": "Taken. Try another name."
}
```



