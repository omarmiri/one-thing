# Json Rpc Response Error

Source: /#/python/x-redirect/JTI0bSUyRkpzb25ScGNSZXNwb25zZV9FcnJvcg


# Class Name

`JsonRpcResponseErrorException`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `jsonrpc` | `str` | Required, Constant | **Value**: `"2.0"` |
| `id` | str \| int \| None | Required | This is a container for one-of cases. |
| `result` | `Any` | Optional | For `tools/call`: `content` (the answer as JSON text), `structuredContent` (the same object) and `isError`. |
| `error` | [`Error1`](/llms-pages/python/models/structures/error-1.md) | Optional | - |


# Example

```python
try:
    # make the API call
except JsonRpcResponseErrorException as e:
    print(e)
except ApiException as e:
    print(e)
```



