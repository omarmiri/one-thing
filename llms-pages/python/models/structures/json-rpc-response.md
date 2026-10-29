# Json Rpc Response

Source: /#/python/x-redirect/JTI0bSUyRkpzb25ScGNSZXNwb25zZQ

A JSON-RPC 2.0 reply from the MCP server.


# Class Name

`JsonRpcResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `jsonrpc` | `str` | Required, Constant | Always `2.0`.<br><br>**Value**: `"2.0"` |
| `id` | str \| int \| None | Required | This is a container for one-of cases. |
| `result` | `Any` | Optional | For `tools/call`: `content` (the answer as JSON text), `structuredContent` (the same object) and `isError`. |
| `error` | [`Error`](/llms-pages/python/models/structures/error.md) | Optional | Present when the call failed. |


# Example

```python
import jsonpickle

from onethingapi.models.json_rpc_response import JsonRpcResponse

json_rpc_response = JsonRpcResponse(
    id=1,
    result=jsonpickle.decode('{"content":[{"type":"text","text":"{\\"shop\\": \\"vintageskates\\"}"}],"isError":false}')
)
```



