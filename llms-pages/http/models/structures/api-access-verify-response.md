# Api Access Verify Response

Source: /#/http/x-redirect/JTI0bSUyRkFwaSUyNTIwQWNjZXNzJTI1MjBWZXJpZnklMjUyMFJlc3BvbnNl

Whether the code is valid.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `valid` | `Boolean` | Required | True if the code belongs to a paid, unrefunded order for this shop. |
| `product` | `String` | Optional | The product name, when valid. |


# Example (as JSON)

```json
{
  "valid": true,
  "product": "Vintage Cream and Red Roller Skates"
}
```



