# Search Products

Source: /#/typescript/x-redirect/JTI0ZSUyRlByb2R1Y3RzJTJGc2VhcmNoUHJvZHVjdHM

Searches 100M+ products from 25k+ stores through Channel3. Pass a result's `id` to `createShop` with `source=channel3`.

:information_source: **Note** This endpoint does not require authentication.

```ts
async searchProducts(
  q: string,
  requestOptions?: RequestOptions
): Promise<ApiResponse<ApiChannel3SearchResponse>>
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `q` | `string` | Query, Required | What to look for, in plain words.<br><br>**Constraints**: *Maximum Length*: `200` |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: Up to 12 products.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`ApiChannel3SearchResponse`](/llms-pages/typescript/models/structures/api-channel-3-search-response.md).


# Example Usage

```ts
const q = 'gifts for trail runners under $60';

try {
  const response = await productsApi.searchProducts(q);

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
  "products": [
    {
      "id": "ch3_7f2a9c1e",
      "title": "Trail Running Vest 5L",
      "brand": "Salomon",
      "image": "https://images.example.com/vest.jpg",
      "price": 59.99,
      "currency": "USD",
      "retailer": "rei.com",
      "retailers": 4,
      "commission": 0.08
    }
  ]
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |
| 503 | Gemini, PayPal or Channel3 failed or isn't configured. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |



