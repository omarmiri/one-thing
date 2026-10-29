# Json Rpc Request

Source: /#/python/x-redirect/JTI0bSUyRkpzb25ScGNSZXF1ZXN0

A JSON-RPC 2.0 request to the MCP server.


# Class Name

`JsonRpcRequest`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `jsonrpc` | `str` | Required, Constant | Always `2.0`.<br><br>**Value**: `"2.0"` |
| `id` | str \| int \| None | Optional | This is a container for one-of cases. |
| `method` | [`Method`](/llms-pages/python/models/enumerations/method.md) | Required | The MCP method. `tools/call` runs a tool; `tools/list` lists them. |
| `params` | `Any` | Optional | For `tools/call`: `{ name, arguments }`. |


# Example

```python
import jsonpickle

from onethingapi.models.json_rpc_request import JsonRpcRequest
from onethingapi.models.method import Method

json_rpc_request = JsonRpcRequest(
    method=Method.ENUM_TOOLSCALL,
    id=1,
    params=jsonpickle.decode('{"name":"get_product","arguments":{"shop":"vintageskates"}}')
)
```



