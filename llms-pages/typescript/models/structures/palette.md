# Palette

Source: /#/typescript/x-redirect/JTI0bSUyRlBhbGV0dGU


# Interface Name

`Palette`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `background` | `string` | Required | **Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |
| `surface` | `string` | Required | **Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |
| `text` | `string` | Required | **Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |
| `muted` | `string` | Required | **Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |
| `accent` | `string` | Required | **Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |
| `accentText` | `string` | Required | **Constraints**: *Pattern*: `^#[0-9a-fA-F]{6}$` |


# Example

```ts
import { Palette } from 'one-thing-sdk';

const palette: Palette = {
  background: '#14171a',
  surface: '#14171a',
  text: '#14171a',
  muted: '#14171a',
  accent: '#14171a',
  accentText: '#14171a',
};
```



