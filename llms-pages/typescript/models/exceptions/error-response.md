# Error Response

Source: /#/typescript/x-redirect/JTI0bSUyRkVycm9yUmVzcG9uc2U

An error reply.


# Class Name

`ErrorResponseError`


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
  if (error instanceof ErrorResponseError) {
    console.log(error.result);
  }
}
```



