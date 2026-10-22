# Check Missing Details

Source: /#/typescript/x-redirect/JTI0ZSUyRlNob3BzJTJGY2hlY2tNaXNzaW5nRGV0YWlscw

Asks Gemini what buyers will want to choose (sizes, colours) and what they'll ask that the
listing doesn't say (dimensions, materials). `createShop` already does this once; call it
again after editing the product. The result is saved as the shop's `suggestions`.

Nothing changes on the shop page until the seller confirms: save options with `updateShop`
(`options`), and answer the questions with `updateShop` (`facts`). Not for recommendations.

```ts
async checkMissingDetails(
  slug: string,
  requestOptions?: RequestOptions
): Promise<ApiResponse<Suggestions>>
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `string` | Template, Required | The shop's link name (current or former). |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: The suggestions.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`Suggestions`](/llms-pages/typescript/models/structures/suggestions.md).


# Example Usage

```ts
const slug = 'raptorrush';

try {
  const response = await shopsApi.checkMissingDetails(slug);

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
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |



