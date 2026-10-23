# List My Shops

Source: /#/typescript/x-redirect/JTI0ZSUyRlBsYXRmb3JtcyUyRmxpc3RNeVNob3Bz

Every shop the API key's account owns, newest first, with what a catalog page needs: name, price, cover, link, whether PayPal is connected and how many sales it has.

```ts
async listMyShops(
  status?: Status,
  requestOptions?: RequestOptions
): Promise<ApiResponse<ApiPlatformShopsResponse>>
```


# Authentication

This endpoint requires [PlatformKey](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `status` | [`Status \| undefined`](/llms-pages/typescript/models/enumerations/status.md) | Query, Optional | Only shops with this status, e.g. `live` for a public catalog. |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: The shops.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`ApiPlatformShopsResponse`](/llms-pages/typescript/models/structures/api-platform-shops-response.md).


# Example Usage

```ts
const status = Status.Live;

try {
  const response = await platformsApi.listMyShops(status);

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
  "shops": [
    {
      "slug": "raptorrush",
      "status": "live",
      "name": "Raptor Rush: Browser Edition",
      "headline": "Grow from Tiny Hatchling to Giant Apex Predator",
      "product_type": "digital",
      "price": {
        "amount": 2.99,
        "currency": "USD"
      },
      "url": "https://one-thing-ash0.onrender.com/raptorrush",
      "cover": "https://one-thing-ash0.onrender.com/api/blobs/KchAi9jwZzo76SKh",
      "paypal_connected": true,
      "sales": 12,
      "created_at": "2026-10-12T20:31:44Z"
    }
  ]
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 401 | No API key, or it's wrong or revoked. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |



