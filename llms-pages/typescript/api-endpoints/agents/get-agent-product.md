# Get Agent Product

Source: /#/typescript/x-redirect/JTI0ZSUyRkFnZW50cyUyRmdldEFnZW50UHJvZHVjdA

Everything an AI shopping agent needs to describe the product and decide to buy it: price, shipping, delivery, availability, options, images and FAQ. Public. Buying goes through the MCP server named in `mcp_server`. Shop pages also carry the same facts as schema.org `Product` JSON-LD.

:information_source: **Note** This endpoint does not require authentication.

```ts
async getAgentProduct(
  slug: string,
  requestOptions?: RequestOptions
): Promise<ApiResponse<AgentProduct>>
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `string` | Template, Required | The shop's link name (current or former). |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: The product.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`AgentProduct`](/llms-pages/typescript/models/structures/agent-product.md).


# Example Usage

```ts
const slug = 'raptorrush';

try {
  const response = await agentsApi.getAgentProduct(slug);

  // Extracting fully parsed response body.
  console.log(response.result);

  // Extracting response status code.
  console.log(response.statusCode);
  // Extracting response headers.
  console.log(response.headers);
  // Extracting response body of type `string | Stream`
  console.log(response.body);
} catch (error) {
  if (error instanceof ApiError) {
    // Extracting response error status code.
    console.log(error.statusCode);
    // Extracting response error headers.
    console.log(error.headers);
    // Extracting response error body of type `string | Stream`.
    console.log(error.body);
    if (error instanceof CustomError) {
      console.log(error.result);
    }
  }
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | No live shop with that link name. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |



