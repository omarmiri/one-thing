# List Webhook Events

Source: /#/typescript/x-redirect/JTI0ZSUyRk9yZGVycyUyRmxpc3RXZWJob29rRXZlbnRz

The last 50 PayPal webhook deliveries about this shop's orders, with signature results.

```ts
async listWebhookEvents(
  slug: string,
  requestOptions?: RequestOptions
): Promise<ApiResponse<WebhookEvent[]>>
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `string` | Template, Required | The shop's link name (current or former). |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: Events, newest first.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`WebhookEvent[]`](/llms-pages/typescript/models/structures/webhook-event.md).


# Example Usage

```ts
const slug = 'raptorrush';

try {
  const response = await ordersApi.listWebhookEvents(slug);

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
    "id": "WH-2WR32451HC0233532-67976317FL4543714",
    "event_type": "PAYMENT.CAPTURE.COMPLETED",
    "paypal_order_id": "5O190127TN364715T",
    "summary": "255.00 USD",
    "verified": true,
    "outcome": "Confirmed: order already paid",
    "received_at": "2026-10-22T02:41:40Z"
  }
]
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |



