# Create Checkout Order

Source: /#/http/x-redirect/JTI0ZSUyRkNoZWNrb3V0JTJGY3JlYXRlQ2hlY2tvdXRPcmRlcg

Creates the PayPal order for one unit of a live shop's product. The amount always comes
from the shop, never from the caller. Pass the returned `id` to the PayPal JS SDK.

If the shop has buyer `options`, send one value for each. A sold-out combination answers 409.

:information_source: **Note** This endpoint does not require authentication.

```http
POST /api/orders
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `body` | [`Api Orders Request`](/llms-pages/http/models/structures/api-orders-request.md) | Body, Required | - |


# Response Type

**200**: PayPal order created.

[`Api Orders Response`](/llms-pages/http/models/structures/api-orders-response.md)


# Example Usage

```bash
curl -X POST \
  --url 'https://one-thing-ash0.onrender.com/api/orders'  \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  --data-raw '{
  "slug": "slug0",
  "options": {
    "Size": "M",
    "Color": "Black"
  }
}'
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |
| 409 | Taken or unavailable (a link name, or a sold-out product). | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |
| 503 | Gemini, PayPal or Channel3 failed or isn't configured. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |



