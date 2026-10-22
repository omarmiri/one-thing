# Set Photo Order

Source: /#/typescript/x-redirect/JTI0ZSUyRlNob3BzJTJGc2V0UGhvdG9PcmRlcg

Sets the photo order; the first becomes the cover. Leaving a photo out removes it.

```ts
async setPhotoOrder(
  slug: string,
  body: ApiShopsPhotosRequest,
  requestOptions?: RequestOptions
): Promise<ApiResponse<ShopPhotos>>
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `string` | Template, Required | The shop's link name (current or former). |
| `body` | [`ApiShopsPhotosRequest`](/llms-pages/typescript/models/structures/api-shops-photos-request.md) | Body, Required | - |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: The shop's photos, cover first.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`ShopPhotos`](/llms-pages/typescript/models/structures/shop-photos.md).


# Example Usage

```ts
const slug = 'raptorrush';

const body: ApiShopsPhotosRequest = {
  photos: [
    'photos8',
    'photos9'
  ],
};

try {
  const response = await shopsApi.setPhotoOrder(
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
| 404 | No such shop, or the admin token or API key doesn't match it. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |



