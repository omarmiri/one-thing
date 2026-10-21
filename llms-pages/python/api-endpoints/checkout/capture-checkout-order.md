# Capture Checkout Order

Source: /#/python/x-redirect/JTI0ZSUyRkNoZWNrb3V0JTJGY2FwdHVyZUNoZWNrb3V0T3JkZXI

Call after the buyer approves. Records the sale; digital orders get a download link or access code.
Safe to call repeatedly: before approval it answers 409, so a page can poll it while the PayPal window is open.

:information_source: **Note** This endpoint does not require authentication.

```python
def capture_checkout_order(self,
                          paypal_order_id)
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `paypal_order_id` | `str` | Template, Required | The PayPal order id that `createCheckoutOrder` returned. |


# Response Type

**200**: Paid.

[`ApiOrdersCaptureResponse`](/llms-pages/python/models/structures/api-orders-capture-response.md)


# Example Usage

```python
paypal_order_id = 'paypalOrderId6'

result = checkout_api.capture_checkout_order(paypal_order_id)
print(result)
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 402 | Something in the request needs fixing; `error` says what. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 404 | No such shop, or the admin token doesn't match it. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 409 | The buyer hasn't approved the order yet. | [`ApiOrdersCapture409ErrorException`](/llms-pages/python/models/exceptions/api-orders-capture-409-error.md) |
| 422 | The buyer's funding source was declined (`INSTRUMENT_DECLINED`); they can try another. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |



