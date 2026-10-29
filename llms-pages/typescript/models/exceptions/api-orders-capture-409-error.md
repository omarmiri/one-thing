# Api Orders Capture 409 Error

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwT3JkZXJzJTI1MjBDYXB0dXJlJTI1MjA0MDklMjUyMEVycm9y

Not approved yet.


# Class Name

`ApiOrdersCapture409Error`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `status` | [`Status6 \| undefined`](/llms-pages/typescript/models/enumerations/status-6.md) | Optional | `pending` until the buyer approves at PayPal. |


# Example

```ts
try {
  // make the API call
} catch (error) {
  if (error instanceof ApiOrdersCapture409Error) {
    console.log(error.result);
  }
}
```



