# Add Photos

Source: /#/typescript/x-redirect/JTI0ZSUyRlNob3BzJTJGYWRkUGhvdG9z

Adds one or more photos after the cover. Each is turned upright, resized to at most 2000 px and stored as WebP. A shop holds up to 8 photos; buyers swipe through them on the shop page. Not for recommendations, which show the retailer's photos.

```ts
async addPhotos(
  slug: string,
  photo: FileWrapper,
  requestOptions?: RequestOptions
): Promise<ApiResponse<ShopPhotos>>
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `string` | Template, Required | The shop's link name (current or former). |
| `photo` | `FileWrapper` | Form, Required | An image, up to 15 MB. The endpoint also accepts the field repeated, to add several in one request. |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: The shop's photos, cover first.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`ShopPhotos`](/llms-pages/typescript/models/structures/shop-photos.md).


# Example Usage

```ts
const slug = 'raptorrush';

const photo = new FileWrapper(fs.createReadStream('dummy_file'));

try {
  const response = await shopsApi.addPhotos(
    slug,
    photo
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


# Example Response *(as JSON)*

```json
{
  "photos": [
    {
      "id": "LFRvGuTU3D8i334X",
      "url": "/api/blobs/LFRvGuTU3D8i334X"
    },
    {
      "id": "zrySajNyao6_j11x",
      "url": "/api/blobs/zrySajNyao6_j11x"
    }
  ]
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |



