# Api Shops Orders Refund 409 Error

Source: /#/http/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyME9yZGVycyUyNTIwUmVmdW5kJTI1MjA0MDklMjUyMEVycm9y

Why the order can't be refunded here.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `error` | `String` | Required | A sentence you can show to a person. |
| `field` | `String` | Optional | The form field at fault, when there is one. |
| `detail` | `String` | Optional | The upstream service's own message, for debugging. |
| `refundInPayPal` | `Boolean` | Optional | Refund it in PayPal yourself, then call again with `record: true`. |



