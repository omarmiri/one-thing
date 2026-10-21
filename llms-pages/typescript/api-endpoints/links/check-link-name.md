# Check Link Name

Source: /#/typescript/x-redirect/JTI0ZSUyRkxpbmtzJTJGY2hlY2tMaW5rTmFtZQ

Normalises a proposed link name and says whether a new shop can use it.

:information_source: **Note** This endpoint does not require authentication.

```ts
async checkLinkName(
  name: string,
  requestOptions?: RequestOptions
): Promise<ApiResponse<ApiSlugsCheckResponse>>
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `name` | `string` | Query, Required | Anything; it is normalised (`Raptor Rush` becomes `raptor-rush`). |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: The normalised name and whether it can be used.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`ApiSlugsCheckResponse`](/llms-pages/typescript/models/structures/api-slugs-check-response.md).


# Example Usage

```ts
const name = 'name0';

try {
  const response = await linksApi.checkLinkName(name);

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



