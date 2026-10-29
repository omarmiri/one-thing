# Capture Checkout Order

Source: /#/typescript/x-redirect/JTI0ZSUyRkNoZWNrb3V0JTJGY2FwdHVyZUNoZWNrb3V0T3JkZXI

Call after the buyer approves. Records the sale; digital orders get a download link or access code.
Safe to call repeatedly: before approval it answers 409, so a page can poll it while the PayPal window is open.

:information_source: **Note** This endpoint does not require authentication.

```ts
async captureCheckoutOrder(
  paypalOrderId: string,
  requestOptions?: RequestOptions
): Promise<ApiResponse<ApiOrdersCaptureResponse>>
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `paypalOrderId` | `string` | Template, Required | The PayPal order id that `createCheckoutOrder` returned. |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: Paid.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`ApiOrdersCaptureResponse`](/llms-pages/typescript/models/structures/api-orders-capture-response.md).


# Example Usage

```ts
const paypalOrderId = '5O190127TN364715T';

try {
  const response = await checkoutApi.captureCheckoutOrder(paypalOrderId);

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
    if (error instanceof ErrorResponseError) {
      console.log(error.result);
    } else if (error instanceof ApiOrdersCapture409Error) {
      console.log(error.result);
    }
  }
}
```


# Example Response *(as JSON)*

```json
{
  "orderId": "pX4kR9tVb2nQ7sLe",
  "status": "paid"
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 402 | Something in the request needs fixing; `error` says what. | [`ErrorResponseError`](/llms-pages/typescript/models/exceptions/error-response.md) |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`ErrorResponseError`](/llms-pages/typescript/models/exceptions/error-response.md) |
| 409 | The buyer hasn't approved the order yet. | [`ApiOrdersCapture409Error`](/llms-pages/typescript/models/exceptions/api-orders-capture-409-error.md) |
| 410 | The last unit (or the last of the buyer's combination) sold while they were paying, or the PayPal checkout expired before they paid. The payment isn't captured, so the buyer isn't charged. | [`ErrorResponseError`](/llms-pages/typescript/models/exceptions/error-response.md) |
| 422 | The buyer's funding source was declined (`INSTRUMENT_DECLINED`); they can try another. | [`ErrorResponseError`](/llms-pages/typescript/models/exceptions/error-response.md) |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`ErrorResponseError`](/llms-pages/typescript/models/exceptions/error-response.md) |



