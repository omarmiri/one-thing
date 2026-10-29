# Api Shops Orders Refund 409 Error

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyME9yZGVycyUyNTIwUmVmdW5kJTI1MjA0MDklMjUyMEVycm9y


# Class Name

`ApiShopsOrdersRefund409Error`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `error` | `string` | Required | A sentence you can show to a person. |
| `field` | `string \| undefined` | Optional | The form field at fault, when there is one. |
| `detail` | `string \| undefined` | Optional | The upstream service's own message, for debugging. |
| `refundInPayPal` | `boolean \| undefined` | Optional | Refund it in PayPal yourself, then call again with `record: true`. |


# Example

```ts
try {
  // make the API call
} catch (error) {
  if (error instanceof ApiShopsOrdersRefund409Error) {
    console.log(error.result);
  }
}
```



