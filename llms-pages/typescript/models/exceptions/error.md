# Error

Source: /#/typescript/x-redirect/JTI0bSUyRkVycm9y


# Class Name

`CustomError`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `error` | `string` | Required | A sentence you can show to a person. |
| `field` | `string \| undefined` | Optional | The form field at fault, when there is one. |
| `detail` | `string \| undefined` | Optional | The upstream service's own message, for debugging. |


# Example

```ts
try {
  // make the API call
} catch (error) {
  if (error instanceof CustomError) {
    console.log(error.result);
  }
}
```



