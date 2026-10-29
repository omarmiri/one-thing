# Call Mcp Response

Source: /#/typescript/x-redirect/JTI0bSUyRkNhbGxNY3BSZXNwb25zZQ


# Class Name

`CallMcpResponse`


# Cases

| Type |
|  --- |
| [`JsonRpcResponse`](/llms-pages/typescript/models/structures/json-rpc-response.md) |
| [`JsonRpcResponse[]`](/llms-pages/typescript/models/structures/json-rpc-response.md) |


# JsonRpcResponse

## Initialization Code

### Example

```ts
const value: CallMcpResponse = {
  jsonrpc: '2.0',
  id: 1,
  result: { 'content': [{ 'type': 'text', 'text': '{ \\'shop\\':  \\'vintageskates\\' }' }], 'isError': false },
};
```


# JsonRpcResponse[]

## Initialization Code

### Example

```ts
const value: CallMcpResponse = [
  {
  jsonrpc: '2.0',
  id: 1,
  result: { 'content': [{ 'type': 'text', 'text': '{ \\'shop\\':  \\'vintageskates\\' }' }], 'isError': false },
}
];
```



