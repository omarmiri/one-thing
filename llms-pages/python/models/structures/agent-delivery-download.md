# Agent Delivery Download

Source: /#/python/x-redirect/JTI0bSUyRkFnZW50RGVsaXZlcnlEb3dubG9hZA

A digital file to download.


# Class Name

`AgentDeliveryDownload`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `mtype` | `str` | Required, Constant | Always `download`.<br><br>**Value**: `"download"` |
| `download_url` | `str` | Required | A private link to the file. It works 5 times over 14 days. |
| `note` | `str` | Optional | How long the link lasts and how many downloads it allows, in words. |


# Example

```python
from onethingapi.models.agent_delivery_download import AgentDeliveryDownload

agent_delivery_download = AgentDeliveryDownload(
    download_url='https://one-thing-ash0.onrender.com/api/download/dl_4mQ8sT2vX9',
    note='Works 5 times over 14 days.'
)
```



