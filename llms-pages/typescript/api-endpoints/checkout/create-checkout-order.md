# Create Checkout Order

Source: /#/typescript/x-redirect/JTI0ZSUyRkNoZWNrb3V0JTJGY3JlYXRlQ2hlY2tvdXRPcmRlcg

Creates the PayPal order for one unit of a live shop's product. The amount always comes
from the shop, never from the caller. Pass the returned `id` to the PayPal JS SDK.

If the shop has buyer `options`, send one value for each. A sold-out combination answers 409.

:information_source: **Note** This endpoint does not require authentication.

```ts
async createCheckoutOrder(
  body: ApiOrdersRequest,
  requestOptions?: RequestOptions
): Promise<ApiResponse<ApiOrdersResponse>>
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `body` | [`ApiOrdersRequest`](/llms-pages/typescript/models/structures/api-orders-request.md) | Body, Required | - |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: PayPal order created.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`ApiOrdersResponse`](/llms-pages/typescript/models/structures/api-orders-response.md).


# Example Usage

```ts
const body: ApiOrdersRequest = {
  slug: 'slug0',
  options: {
    'Size': 'M',
    'Color': 'Black'
  },
};

try {
  const response = await checkoutApi.createCheckoutOrder(body);

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
| 400 | Something in the request needs fixing; `error` says what. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |
| 409 | Taken or unavailable (a link name, or a sold-out product). | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |
| 503 | Gemini, PayPal or Channel3 failed or isn't configured. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |



