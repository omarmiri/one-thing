# Open Pay Link

Source: /#/typescript/x-redirect/JTI0ZSUyRkFnZW50cyUyRm9wZW5QYXlMaW5r

The `pay_url` an agent gives the buyer. It redirects to PayPal's payment page for the order, so PayPal's checkout token never passes through the agent (agent platforms hide such tokens as secrets). A paid order redirects to its thank-you page; an expired checkout goes back to the shop page.

:information_source: **Note** This endpoint does not require authentication.

```ts
async openPayLink(
  orderId: string,
  requestOptions?: RequestOptions
): Promise<ApiResponse<void>>
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `orderId` | `string` | Template, Required | The `order_id` from the MCP `create_order` tool. |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance.


# Example Usage

```ts
const orderId = 'pX4kR9tVb2nQ7sLe';

try {
  const response = await agentsApi.openPayLink(orderId);

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
  }
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | No order with that id. | `ApiError` |



