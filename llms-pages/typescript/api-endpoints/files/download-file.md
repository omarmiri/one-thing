# Download File

Source: /#/typescript/x-redirect/JTI0ZSUyRkZpbGVzJTJGZG93bmxvYWRGaWxl

A paid digital order's private link. Works 5 times within 14 days.

:information_source: **Note** This endpoint does not require authentication.

```ts
async downloadFile(
  token: string,
  requestOptions?: RequestOptions
): Promise<ApiResponse<NodeJS.ReadableStream | Blob>>
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `token` | `string` | Template, Required | The download token from a paid order's thank-you page. |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: The file.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type `NodeJS.ReadableStream | Blob`.


# Example Usage

```ts
const token = 'q2Vd8mLx0RkT4nYb7HcW1sPe';

try {
  const response = await filesApi.downloadFile(token);

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
| 410 | Expired or used up. | `ApiError` |



