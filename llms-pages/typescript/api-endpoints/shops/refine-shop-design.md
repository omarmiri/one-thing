# Refine Shop Design

Source: /#/typescript/x-redirect/JTI0ZSUyRlNob3BzJTJGcmVmaW5lU2hvcERlc2lnbg

"Make it warmer", "shorter copy", "more premium". Gemini edits the design spec.

```ts
async refineShopDesign(
  slug: string,
  body: ApiShopsRefineRequest,
  requestOptions?: RequestOptions
): Promise<ApiResponse<ApiShopsRefineResponse>>
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `string` | Template, Required | The shop's link name (current or former). |
| `body` | [`ApiShopsRefineRequest`](/llms-pages/typescript/models/structures/api-shops-refine-request.md) | Body, Required | - |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: The new design.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`ApiShopsRefineResponse`](/llms-pages/typescript/models/structures/api-shops-refine-response.md).


# Example Usage

```ts
const slug = 'raptorrush';

const body: ApiShopsRefineRequest = {
  instruction: 'Make it feel more premium',
};

try {
  const response = await shopsApi.refineShopDesign(
    slug,
    body
  );

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
| 404 | No such shop, or the admin token doesn't match it. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |



