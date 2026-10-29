# Agent Delivery Download

Source: /#/http/x-redirect/JTI0bSUyRkFnZW50RGVsaXZlcnlEb3dubG9hZA

A digital file to download.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `type` | `String` | Required, Constant | Always `download`.<br><br>**Value**: `download` |
| `download_url` | `String` | Required | A private link to the file. It works 5 times over 14 days. |
| `note` | `String` | Optional | How long the link lasts and how many downloads it allows, in words. |


# Example (as JSON)

```json
{
  "type": "download",
  "download_url": "https://one-thing-ash0.onrender.com/api/download/dl_4mQ8sT2vX9",
  "note": "Works 5 times over 14 days."
}
```



