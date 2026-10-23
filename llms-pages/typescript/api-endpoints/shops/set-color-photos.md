# Set Color Photos

Source: /#/typescript/x-redirect/JTI0ZSUyRlNob3BzJTJGc2V0Q29sb3JQaG90b3M

Saves which photo shows each colour, and nothing else about the shop. Only colours already saved in the shop's options change; `null` clears a colour's photo. A photo id that isn't one of the shop's photos is ignored.

```ts
async setColorPhotos(
  slug: string,
  body: ApiShopsColorPhotosRequest,
  requestOptions?: RequestOptions
): Promise<ApiResponse<ApiShopsColorPhotosResponse>>
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `string` | Template, Required | The shop's link name (current or former). |
| `body` | [`ApiShopsColorPhotosRequest`](/llms-pages/typescript/models/structures/api-shops-color-photos-request.md) | Body, Required | - |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: The colours that were changed.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`ApiShopsColorPhotosResponse`](/llms-pages/typescript/models/structures/api-shops-color-photos-response.md).


# Example Usage

```ts
const slug = 'raptorrush';

const body: ApiShopsColorPhotosRequest = {
  photos: {
    'Cream': 'LFRvGuTU3D8i334X',
    'Red': 'photos9'
  },
};

try {
  const response = await shopsApi.setColorPhotos(
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


# Example Response *(as JSON)*

```json
{
  "saved": [
    "Cream",
    "Red"
  ]
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |



