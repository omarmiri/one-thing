# Refund Order

Source: /#/typescript/x-redirect/JTI0ZSUyRk9yZGVycyUyRnJlZnVuZE9yZGVy

Refunds the whole payment through PayPal and marks the order `refunded`. When PayPal only lets the paid account refund it (the money went to a PayPal email the seller typed in, not a connected account), the reply is a 409 with `refundInPayPal: true`. Refund it in your PayPal account, then call this again with `{"record": true}`, which only marks it refunded here. Sends the `order.refunded` event to the shop's Zapier hook.

```ts
async refundOrder(
  slug: string,
  orderId: string,
  body?: ApiShopsOrdersRefundRequest,
  requestOptions?: RequestOptions
): Promise<ApiResponse<ApiShopsOrdersRefundResponse>>
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `string` | Template, Required | The shop's link name (current or former). |
| `orderId` | `string` | Template, Required | OneThing's order id (`Order.id`). |
| `body` | [`ApiShopsOrdersRefundRequest \| undefined`](/llms-pages/typescript/models/structures/api-shops-orders-refund-request.md) | Body, Optional | - |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: Refunded.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`ApiShopsOrdersRefundResponse`](/llms-pages/typescript/models/structures/api-shops-orders-refund-response.md).


# Example Usage

```ts
const slug = 'raptorrush';

const orderId = 'pX4kR9tVb2nQ7sLe';

const body: ApiShopsOrdersRefundRequest = {
};

try {
  const response = await ordersApi.refundOrder(
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
    } else if (error instanceof ApiShopsOrdersRefund409Error) {
      console.log(error.result);
    }
  }
}
```


# Example Response *(as JSON)*

```json
{
  "ok": true,
  "refundId": "1JU08902781691411"
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | No such shop or order, or the token doesn't match the shop. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |
| 409 | Not refundable here; `error` says why. | [`ApiShopsOrdersRefund409Error`](/llms-pages/typescript/models/exceptions/api-shops-orders-refund-409-error.md) |



