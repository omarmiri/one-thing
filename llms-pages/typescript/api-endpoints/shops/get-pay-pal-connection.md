# Get Pay Pal Connection

Source: /#/typescript/x-redirect/JTI0ZSUyRlNob3BzJTJGZ2V0UGF5UGFsQ29ubmVjdGlvbg

Asks PayPal where the seller's connection stands and saves it on the shop. Also finds a connection the seller finished at PayPal without coming back.

```ts
async getPayPalConnection(
  slug: string,
  requestOptions?: RequestOptions
): Promise<ApiResponse<ApiShopsPaypalResponse1>>
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `string` | Template, Required | The shop's link name (current or former). |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: The connection, or nulls if there is none yet.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`ApiShopsPaypalResponse1`](/llms-pages/typescript/models/structures/api-shops-paypal-response-1.md).


# Example Usage

```ts
const slug = 'raptorrush';

try {
  const response = await shopsApi.getPayPalConnection(slug);

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


# Example Response *(as JSON)*

```json
{
  "merchantId": "7MZJ4QXN8K2LA",
  "status": {
    "receivable": true,
    "emailConfirmed": true,
    "checkedAt": "2026-10-21T18:04:11Z"
  }
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |
| 503 | Gemini, PayPal or Channel3 failed or isn't configured. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |



