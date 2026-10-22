# Mark Order Shipped

Source: /#/python/x-redirect/JTI0ZSUyRk9yZGVycyUyRm1hcmtPcmRlclNoaXBwZWQ

Saves the tracking number and pushes it to PayPal, so the buyer sees it in PayPal.

```python
def mark_order_shipped(self,
                      slug,
                      order_id,
                      body)
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/python/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/python/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Template, Required | The shop's link name (current or former). |
| `order_id` | `str` | Template, Required | OneThing's order id (`Order.id`). |
| `body` | [`ApiShopsOrdersShipRequest`](/llms-pages/python/models/structures/api-shops-orders-ship-request.md) | Body, Required | - |


# Response Type

**200**: Shipped.

[`ApiShopsOrdersShipResponse`](/llms-pages/python/models/structures/api-shops-orders-ship-response.md)


# Example Usage

```python
slug = 'raptorrush'

order_id = 'orderId2'

body = ApiShopsOrdersShipRequest(
    carrier=Carrier.DHL,
    tracking_number='trackingNumber4'
)

result = orders_api.mark_order_shipped(
    slug,
    order_id,
    body
)
print(result)
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |



