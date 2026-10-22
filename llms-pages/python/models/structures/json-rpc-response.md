# Json Rpc Response

Source: /#/python/x-redirect/JTI0bSUyRkpzb25ScGNSZXNwb25zZQ


# Class Name

`JsonRpcResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `jsonrpc` | `str` | Required, Constant | **Value**: `"2.0"` |
| `id` | str \| int \| None | Required | This is a container for one-of cases. |
| `result` | `Any` | Optional | For `tools/call`: `content` (the answer as JSON text), `structuredContent` (the same object) and `isError`. |
| `error` | [`Error1`](/llms-pages/python/models/structures/error-1.md) | Optional | - |


# Example

```python
import jsonpickle

from onethingapi.models.error_1 import Error1
from onethingapi.models.json_rpc_response import JsonRpcResponse

json_rpc_response = JsonRpcResponse(
    id='String3',
    result=jsonpickle.decode('{"key1":"val1","key2":"val2"}'),
    error=Error1(
        code=24,
        message='message4'
    )
)
```



