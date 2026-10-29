# Verify Access Code

Source: /#/typescript/x-redirect/JTI0ZSUyRkFjY2VzcyUyNTIwY29kZXMlMkZ2ZXJpZnlBY2Nlc3NDb2Rl

For apps and games sold with access codes. Callable from any origin (CORS `*`): it only
answers valid or not for one shop, and counts uses. Accepts the shop's current or former
link names, and codes typed loosely (lower case, spaces, no dashes).

:information_source: **Note** This endpoint does not require authentication.

```ts
async verifyAccessCode(
  body: ApiAccessVerifyRequest,
  requestOptions?: RequestOptions
): Promise<ApiResponse<ApiAccessVerifyResponse>>
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `body` | [`ApiAccessVerifyRequest`](/llms-pages/typescript/models/structures/api-access-verify-request.md) | Body, Required | The shop and the code to check. |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: The answer. Invalid codes are also a 200.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`ApiAccessVerifyResponse`](/llms-pages/typescript/models/structures/api-access-verify-response.md).


# Example Usage

```ts
const body: ApiAccessVerifyRequest = {
  shop: 'raptorrush',
  code: 'K7QF-M2XP-9HTD',
};

try {
  const response = await accessCodesApi.verifyAccessCode(body);

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


# Example Response *(as JSON)*

```json
{
  "valid": true,
  "product": "Raptor Rush: Browser Edition"
}
```



