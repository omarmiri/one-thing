# Connect Pay Pal

Source: /#/typescript/x-redirect/JTI0ZSUyRlNob3BzJTJGY29ubmVjdFBheVBhbA

Starts PayPal's seller onboarding (Partner Referrals). Send the seller's browser to the
returned `url`; they sign in to PayPal (or create a business account) and grant OneThing
permission. PayPal brings them back to `/api/shops/<slug>/paypal/return`, which saves the
connection and opens the manage page. From then on, sales are paid to that account.

Without a connection, a shop can still go live with a typed `paypal_email`.

**Platforms:** call it with your API key and a `returnUrl`, and PayPal's flow ends on your own
page instead, as `returnUrl?paypal=connected|incomplete|cancelled|failed&shop=<slug>`. The
URL's origin must be one registered on the key.

```ts
async connectPayPal(
  slug: string,
  body?: ApiShopsPaypalRequest,
  requestOptions?: RequestOptions
): Promise<ApiResponse<ApiShopsPaypalResponse>>
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `string` | Template, Required | The shop's link name (current or former). |
| `body` | [`ApiShopsPaypalRequest \| undefined`](/llms-pages/typescript/models/structures/api-shops-paypal-request.md) | Body, Optional | - |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: Where to send the seller.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`ApiShopsPaypalResponse`](/llms-pages/typescript/models/structures/api-shops-paypal-response.md).


# Example Usage

```ts
const slug = 'raptorrush';

const body: ApiShopsPaypalRequest = {
  returnUrl: 'https://www.miriogames.com/market/manage/?g=7Hq2',
};

try {
  const response = await shopsApi.connectPayPal(
    slug,
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


# Example Response *(as JSON)*

```json
{
  "url": "https://www.sandbox.paypal.com/bizsignup/partner/entry?referralToken=EXAMPLE"
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |
| 503 | Gemini, PayPal or Channel3 failed or isn't configured. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |



