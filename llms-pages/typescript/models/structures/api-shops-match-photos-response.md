# Api Shops Match Photos Response

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyME1hdGNoJTI1MjBQaG90b3MlMjUyMFJlc3BvbnNl

Gemini's matches.


# Interface Name

`ApiShopsMatchPhotosResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `matches` | `Record<string, string>` | Required | Colour label → photo id. |


# Example

```ts
import { ApiShopsMatchPhotosResponse } from 'one-thing-sdk';

const apiShopsMatchPhotosResponse: ApiShopsMatchPhotosResponse = {
  matches: {
    'Black': 'b_8f2k1',
    'Forest green': 'b_q93md'
  },
};
```



