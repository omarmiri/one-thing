# Mark Order Shipped

Source: /#/typescript/x-redirect/JTI0ZSUyRk9yZGVycyUyRm1hcmtPcmRlclNoaXBwZWQ

Saves the tracking number and pushes it to PayPal, so the buyer sees it in PayPal.

```ts
async markOrderShipped(
  slug: string,
  orderId: string,
  body: ApiShopsOrdersShipRequest,
  requestOptions?: RequestOptions
): Promise<ApiResponse<ApiShopsOrdersShipResponse>>
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `string` | Template, Required | The shop's link name (current or former). |
| `orderId` | `string` | Template, Required | OneThing's order id (`Order.id`). |
| `body` | [`ApiShopsOrdersShipRequest`](/llms-pages/typescript/models/structures/api-shops-orders-ship-request.md) | Body, Required | - |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: Shipped.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`ApiShopsOrdersShipResponse`](/llms-pages/typescript/models/structures/api-shops-orders-ship-response.md).


# Example Usage

```ts
const slug = 'raptorrush';

const orderId = 'orderId2';

const body: ApiShopsOrdersShipRequest = {
  carrier: Carrier.Dhl,
  trackingNumber: 'trackingNumber4',
};

try {
  const response = await ordersApi.markOrderShipped(
    slug,
    orderId,
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


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |
| 404 | No such shop, or the admin token doesn't match it. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |



