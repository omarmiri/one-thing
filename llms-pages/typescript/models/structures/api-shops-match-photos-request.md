# Api Shops Match Photos Request

Source: /#/typescript/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyME1hdGNoJTI1MjBQaG90b3MlMjUyMFJlcXVlc3Q


# Interface Name

`ApiShopsMatchPhotosRequest`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `colors` | [`Color[]`](/llms-pages/typescript/models/structures/color.md) | Required | **Constraints**: *Minimum Items*: `1`, *Maximum Items*: `12` |


# Example

```ts
import { ApiShopsMatchPhotosRequest } from 'one-thing-sdk';

const apiShopsMatchPhotosRequest: ApiShopsMatchPhotosRequest = {
  colors: [
    {
      label: 'Forest green',
      hex: '#14171a',
    }
  ],
};
```



