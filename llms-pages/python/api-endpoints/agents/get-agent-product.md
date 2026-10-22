# Get Agent Product

Source: /#/python/x-redirect/JTI0ZSUyRkFnZW50cyUyRmdldEFnZW50UHJvZHVjdA

Everything an AI shopping agent needs to describe the product and decide to buy it: price, shipping, delivery, availability, options, images and FAQ. Public. Buying goes through the MCP server named in `mcp_server`. Shop pages also carry the same facts as schema.org `Product` JSON-LD.

:information_source: **Note** This endpoint does not require authentication.

```python
def get_agent_product(self,
                     slug)
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Template, Required | The shop's link name (current or former). |


# Response Type

**200**: The product.

[`AgentProduct`](/llms-pages/python/models/structures/agent-product.md)


# Example Usage

```python
slug = 'raptorrush'

result = agents_api.get_agent_product(slug)
print(result)
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | No live shop with that link name. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |



