# Error

Source: /#/typescript/x-redirect/JTI0bSUyRkVycm9y

Present when the call failed.


# Interface Name

`Error`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `code` | `number` | Required | The JSON-RPC error code. |
| `message` | `string` | Required | What went wrong. |


# Example

```ts
import { Error } from 'one-thing-sdk';

const error: Error = {
  code: -32601,
  message: 'Method not found',
};
```



