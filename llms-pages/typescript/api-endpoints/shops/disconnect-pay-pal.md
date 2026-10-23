# Disconnect Pay Pal

Source: /#/typescript/x-redirect/JTI0ZSUyRlNob3BzJTJGZGlzY29ubmVjdFBheVBhbA

Forgets the connected account. Sales go back to the shop's `paypal_email`.

```ts
async disconnectPayPal(
  slug: string,
  requestOptions?: RequestOptions
): Promise<ApiResponse<Ok>>
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `string` | Template, Required | The shop's link name (current or former). |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: Done.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`Ok`](/llms-pages/typescript/models/structures/ok.md).


# Example Usage

```ts
const slug = 'raptorrush';

try {
  const response = await shopsApi.disconnectPayPal(slug);

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
  "ok": true
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |



