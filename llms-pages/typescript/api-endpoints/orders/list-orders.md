# List Orders

Source: /#/typescript/x-redirect/JTI0ZSUyRk9yZGVycyUyRmxpc3RPcmRlcnM

Newest first. Checkouts that were never approved are left out.

```ts
async listOrders(
  slug: string,
  requestOptions?: RequestOptions
): Promise<ApiResponse<Order[]>>
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `string` | Template, Required | The shop's link name (current or former). |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: Orders.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`Order[]`](/llms-pages/typescript/models/structures/order.md).


# Example Usage

```ts
const slug = 'raptorrush';

try {
  const response = await ordersApi.listOrders(slug);

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
[
  {
    "id": "pX4kR9tVb2nQ7sLe",
    "paypal_order_id": "5O190127TN364715T",
    "status": "paid",
    "amount_cents": 25500,
    "shipping_cents": 1500,
    "currency": "USD",
    "buyer_email": "buyer@example.com",
    "buyer_name": "Sam Rivera",
    "shipping_address": {
      "address_line_1": "1 Main St",
      "admin_area_2": "Springfield",
      "admin_area_1": "IL",
      "postal_code": "62701",
      "country_code": "US"
    },
    "capture_id": "3C679366HH908993F",
    "fulfillment_status": "to_ship",
    "carrier": null,
    "tracking_number": null,
    "tracking_synced": false,
    "downloads": 0,
    "access_code": null,
    "code_uses": 0,
    "channel": "agent",
    "options": {
      "Size": "8"
    },
    "paid_at": "2026-10-22T02:41:37Z",
    "created_at": "2026-10-22T02:38:05Z"
  }
]
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |



