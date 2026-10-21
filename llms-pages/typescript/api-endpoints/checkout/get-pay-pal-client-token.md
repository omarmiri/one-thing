# Get Pay Pal Client Token

Source: /#/typescript/x-redirect/JTI0ZSUyRkNoZWNrb3V0JTJGZ2V0UGF5UGFsQ2xpZW50VG9rZW4

A browser-safe client token for the PayPal JavaScript SDK v6
(`paypal.createInstance({ clientToken })`), bound to the requesting site's domain.
Shop pages call this before showing the PayPal button.

:information_source: **Note** This endpoint does not require authentication.

```ts
async getPayPalClientToken(
  requestOptions?: RequestOptions
): Promise<ApiResponse<ApiPaypalClientTokenResponse>>
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: A token for this site's domain.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`ApiPaypalClientTokenResponse`](/llms-pages/typescript/models/structures/api-paypal-client-token-response.md).


# Example Usage

```ts
try {
  const response = await checkoutApi.getPayPalClientToken();

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
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |
| 503 | Gemini, PayPal or Channel3 failed or isn't configured. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |



