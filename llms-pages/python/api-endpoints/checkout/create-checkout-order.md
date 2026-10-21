# Create Checkout Order

Source: /#/python/x-redirect/JTI0ZSUyRkNoZWNrb3V0JTJGY3JlYXRlQ2hlY2tvdXRPcmRlcg

Creates the PayPal order for one unit of a live shop's product. The amount always comes
from the shop, never from the caller. Pass the returned `id` to the PayPal JS SDK.

:information_source: **Note** This endpoint does not require authentication.

```python
def create_checkout_order(self,
                         body)
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `body` | [`ApiOrdersRequest`](/llms-pages/python/models/structures/api-orders-request.md) | Body, Required | - |


# Response Type

**200**: PayPal order created.

[`ApiOrdersResponse`](/llms-pages/python/models/structures/api-orders-response.md)


# Example Usage

```python
body = ApiOrdersRequest(
    slug='slug0'
)

result = checkout_api.create_checkout_order(body)
print(result)
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 404 | No such shop, or the admin token doesn't match it. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 409 | Taken or unavailable (a link name, or a sold-out product). | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 503 | Gemini, PayPal or Channel3 failed or isn't configured. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |



