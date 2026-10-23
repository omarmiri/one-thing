# Agent Delivery Download

Source: /#/typescript/x-redirect/JTI0bSUyRkFnZW50RGVsaXZlcnlEb3dubG9hZA

A digital file to download.


# Interface Name

`AgentDeliveryDownload`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `type` | `string` | Required, Constant | **Value**: `'download'` |
| `downloadUrl` | `string` | Required | - |
| `note` | `string \| undefined` | Optional | - |


# Example

```ts
import { AgentDeliveryDownload } from 'one-thing-sdk';

const agentDeliveryDownload: AgentDeliveryDownload = {
  type: 'download',
  downloadUrl: 'download_url8',
  note: 'note2',
};
```



