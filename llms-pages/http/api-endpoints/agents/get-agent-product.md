# Get Agent Product

Source: /#/http/x-redirect/JTI0ZSUyRkFnZW50cyUyRmdldEFnZW50UHJvZHVjdA

Everything an AI shopping agent needs to describe the product and decide to buy it: price, shipping, delivery, availability, options, images and FAQ. Public. Buying goes through the MCP server named in `mcp_server`. Shop pages also carry the same facts as schema.org `Product` JSON-LD.

:information_source: **Note** This endpoint does not require authentication.

```http
GET /api/agent/shops/{slug}
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Template, Required | The shop's link name (current or former). |


# Response Type

**200**: The product.

[`Agent Product`](/llms-pages/http/models/structures/agent-product.md)


# Example Usage

```bash
curl -X GET \
  --url 'https://one-thing-ash0.onrender.com/api/agent/shops/raptorrush'  \
  -H 'Accept: application/json'
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | No live shop with that link name. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |



