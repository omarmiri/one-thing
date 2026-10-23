# Match Color Photos

Source: /#/typescript/x-redirect/JTI0ZSUyRlNob3BzJTJGbWF0Y2hDb2xvclBob3Rvcw

Gemini looks at the shop's photos and says which one shows each colour, so buyers who pick a colour see it. Suggests only; save the matches with `setColorPhotos`. Needs at least two photos.

```ts
async matchColorPhotos(
  slug: string,
  body: ApiShopsMatchPhotosRequest,
  requestOptions?: RequestOptions
): Promise<ApiResponse<ApiShopsMatchPhotosResponse>>
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `string` | Template, Required | The shop's link name (current or former). |
| `body` | [`ApiShopsMatchPhotosRequest`](/llms-pages/typescript/models/structures/api-shops-match-photos-request.md) | Body, Required | - |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: A photo id for each colour Gemini could match. Colours it couldn't place are left out.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`ApiShopsMatchPhotosResponse`](/llms-pages/typescript/models/structures/api-shops-match-photos-response.md).


# Example Usage

```ts
const slug = 'raptorrush';

const body: ApiShopsMatchPhotosRequest = {
  colors: [
    {
      label: 'Cream',
      hex: '#f3e9d2',
    },
    {
      label: 'Red',
      hex: '#b3261e',
    }
  ],
};

try {
  const response = await shopsApi.matchColorPhotos(
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
  "matches": {
    "Cream": "LFRvGuTU3D8i334X",
    "Red": "SuqcgNv64HWN8H6e"
  }
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |



