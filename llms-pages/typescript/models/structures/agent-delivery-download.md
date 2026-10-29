# Agent Delivery Download

Source: /#/typescript/x-redirect/JTI0bSUyRkFnZW50RGVsaXZlcnlEb3dubG9hZA

A digital file to download.


# Interface Name

`AgentDeliveryDownload`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `type` | `string` | Required, Constant | Always `download`.<br><br>**Value**: `'download'` |
| `downloadUrl` | `string` | Required | A private link to the file. It works 5 times over 14 days. |
| `note` | `string \| undefined` | Optional | How long the link lasts and how many downloads it allows, in words. |


# Example

```ts
import { AgentDeliveryDownload } from 'one-thing-sdk';

const agentDeliveryDownload: AgentDeliveryDownload = {
  type: 'download',
  downloadUrl: 'https://one-thing-ash0.onrender.com/api/download/dl_4mQ8sT2vX9',
  note: 'Works 5 times over 14 days.',
};
```



