# Call Mcp Body

Source: /#/python/x-redirect/JTI0bSUyRkNhbGxNY3BCb2R5


# Data Type

`JsonRpcRequest | List[JsonRpcRequest]`


# Cases

| Type |
|  --- |
| [`JsonRpcRequest`](/llms-pages/python/models/structures/json-rpc-request.md) |
| [`List[JsonRpcRequest]`](/llms-pages/python/models/structures/json-rpc-request.md) |


# JsonRpcRequest

## Initialization Code

### Example

```python
value = JsonRpcRequest(
    method=Method.ENUM_TOOLSCALL,
    id=1,
    params=jsonpickle.decode('{"name":"get_product","arguments":{"shop":"vintageskates"}}')
)
```


# List[JsonRpcRequest]

## Initialization Code

### Example

```python
value = [
    JsonRpcRequest(
        method=Method.ENUM_TOOLSCALL,
        id=1,
        params=jsonpickle.decode('{"name":"get_product","arguments":{"shop":"vintageskates"}}')
    )
]
```



