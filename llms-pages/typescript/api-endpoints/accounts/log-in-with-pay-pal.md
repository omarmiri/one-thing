# Log In with Pay Pal

Source: /#/typescript/x-redirect/JTI0ZSUyRkFjY291bnRzJTJGbG9nSW5XaXRoUGF5UGFs

A link for a browser, not for code: redirects to PayPal's sign-in page. PayPal sends the seller back to `/api/account/paypal/callback`, which signs them in (creating the account the first time), records the PayPal account their sales are paid into, and redirects to `next`.

:information_source: **Note** This endpoint does not require authentication.

```ts
async logInWithPayPal(
  next?: string,
  requestOptions?: RequestOptions
): Promise<ApiResponse<void>>
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `next` | `string \| undefined` | Query, Optional | A path on this site to land on afterwards. Defaults to `/account`. |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance.


# Example Usage

```ts
const next = '/account';

try {
  const response = await accountsApi.logInWithPayPal(next);

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
    }
  }
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 503 | Log in with PayPal isn't switched on for this server. | [`ErrorResponseError`](/llms-pages/typescript/models/exceptions/error-response.md) |



