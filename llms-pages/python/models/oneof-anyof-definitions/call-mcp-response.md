# Call Mcp Response

Source: /#/python/x-redirect/JTI0bSUyRkNhbGxNY3BSZXNwb25zZQ


# Data Type

`JsonRpcResponse | List[JsonRpcResponse]`


# Cases

| Type |
|  --- |
| [`JsonRpcResponse`](/llms-pages/python/models/structures/json-rpc-response.md) |
| [`List[JsonRpcResponse]`](/llms-pages/python/models/structures/json-rpc-response.md) |


# JsonRpcResponse

## Initialization Code

### Example

```python
value = JsonRpcResponse(
    id=1,
    result=jsonpickle.decode('{"content":[{"type":"text","text":"{\\"shop\\": \\"vintageskates\\"}"}],"isError":false}')
)
```


# List[JsonRpcResponse]

## Initialization Code

### Example

```python
value = [
    JsonRpcResponse(
        id=1,
        result=jsonpickle.decode('{"content":[{"type":"text","text":"{\\"shop\\": \\"vintageskates\\"}"}],"isError":false}')
    )
]
```



