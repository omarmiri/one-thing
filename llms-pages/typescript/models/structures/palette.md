# Palette

Source: /#/typescript/x-redirect/JTI0bSUyRlBhbGV0dGU

The page colours, taken from the photo. Text colours are checked for contrast.


# Interface Name

`Palette`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `background` | `string` | Required | A colour as `#rrggbb`.<br><br>**Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |
| `surface` | `string` | Required | A colour as `#rrggbb`.<br><br>**Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |
| `text` | `string` | Required | A colour as `#rrggbb`.<br><br>**Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |
| `muted` | `string` | Required | A colour as `#rrggbb`.<br><br>**Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |
| `accent` | `string` | Required | A colour as `#rrggbb`.<br><br>**Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |
| `accentText` | `string` | Required | A colour as `#rrggbb`.<br><br>**Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |


# Example

```ts
import { Palette } from 'one-thing-sdk';

const palette: Palette = {
  background: '#f7f1e8',
  surface: '#ffffff',
  text: '#1f1a17',
  muted: '#6b625b',
  accent: '#b3262d',
  accentText: '#ffffff',
};
```



