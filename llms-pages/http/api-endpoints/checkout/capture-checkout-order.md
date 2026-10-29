# Capture Checkout Order

Source: /#/http/x-redirect/JTI0ZSUyRkNoZWNrb3V0JTJGY2FwdHVyZUNoZWNrb3V0T3JkZXI

Call after the buyer approves. Records the sale; digital orders get a download link or access code.
Safe to call repeatedly: before approval it answers 409, so a page can poll it while the PayPal window is open.

:information_source: **Note** This endpoint does not require authentication.

```http
POST /api/orders/{paypalOrderId}/capture
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `paypalOrderId` | `String` | Template, Required | The PayPal order id that `createCheckoutOrder` returned. |


# Response Type

**200**: Paid.

[`Api Orders Capture Response`](/llms-pages/http/models/structures/api-orders-capture-response.md)


# Example Usage

```bash
curl -X POST \
  --url 'https://one-thing-ash0.onrender.com/api/orders/5O190127TN364715T/capture'  \
  -H 'Accept: application/json'
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
| 402 | Something in the request needs fixing; `error` says what. | [`ErrorResponse_ErrorException`](/llms-pages/http/models/exceptions/error-response-error.md) |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`ErrorResponse_ErrorException`](/llms-pages/http/models/exceptions/error-response-error.md) |
| 409 | The buyer hasn't approved the order yet. | [`Api Orders Capture 409 ErrorException`](/llms-pages/http/models/exceptions/api-orders-capture-409-error.md) |
| 410 | The last unit (or the last of the buyer's combination) sold while they were paying, or the PayPal checkout expired before they paid. The payment isn't captured, so the buyer isn't charged. | [`ErrorResponse_ErrorException`](/llms-pages/http/models/exceptions/error-response-error.md) |
| 422 | The buyer's funding source was declined (`INSTRUMENT_DECLINED`); they can try another. | [`ErrorResponse_ErrorException`](/llms-pages/http/models/exceptions/error-response-error.md) |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`ErrorResponse_ErrorException`](/llms-pages/http/models/exceptions/error-response-error.md) |



