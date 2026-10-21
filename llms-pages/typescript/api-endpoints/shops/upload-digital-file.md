# Upload Digital File

Source: /#/typescript/x-redirect/JTI0ZSUyRlNob3BzJTJGdXBsb2FkRGlnaXRhbEZpbGU

Uploads or replaces a digital product's file, up to 25 MB. Each paid order gets a download link for it.

```ts
async uploadDigitalFile(
  slug: string,
  file: FileWrapper,
  requestOptions?: RequestOptions
): Promise<ApiResponse<ApiShopsFileResponse>>
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `string` | Template, Required | The shop's link name (current or former). |
| `file` | `FileWrapper` | Form, Required | Up to 25 MB. |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: Uploaded.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`ApiShopsFileResponse`](/llms-pages/typescript/models/structures/api-shops-file-response.md).


# Example Usage

```ts
const slug = 'raptorrush';

const file = new FileWrapper(fs.createReadStream('dummy_file'));

try {
  const response = await shopsApi.uploadDigitalFile(
    slug,
    file
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



