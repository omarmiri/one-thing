# Get Image

Source: /#/typescript/x-redirect/JTI0ZSUyRkZpbGVzJTJGZ2V0SW1hZ2U

Public images only. Purchased files are never served here.

:information_source: **Note** This endpoint does not require authentication.

```ts
async getImage(
  id: string,
  requestOptions?: RequestOptions
): Promise<ApiResponse<unknown>>
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `string` | Template, Required | A shop's `photo_blob` or `hero_blob`. |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: The image.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type `unknown`.


# Example Usage

```ts
const id = 'id0';

try {
  const response = await filesApi.getImage(id);

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
| 404 | Not a public shop image. | `ApiError` |



