# Update Shop

Source: /#/typescript/x-redirect/JTI0ZSUyRlNob3BzJTJGdXBkYXRlU2hvcA

Changes only the fields you send. Renaming `slug` keeps the old link working (it
redirects). Set `status: live` to publish; a digital product needs its file (or, for
access codes, `access_url`) first.

```ts
async updateShop(
  slug: string,
  body: ShopUpdate,
  requestOptions?: RequestOptions
): Promise<ApiResponse<ApiShopsResponse>>
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `string` | Template, Required | The shop's link name (current or former). |
| `body` | [`ShopUpdate`](/llms-pages/typescript/models/structures/shop-update.md) | Body, Required | - |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: Saved.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`ApiShopsResponse`](/llms-pages/typescript/models/structures/api-shops-response.md).


# Example Usage

```ts
const slug = 'raptorrush';

const body: ShopUpdate = {
  status: Status.Live,
};

try {
  const response = await shopsApi.updateShop(
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
  "ok": true,
  "slug": "vintageskates"
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |



