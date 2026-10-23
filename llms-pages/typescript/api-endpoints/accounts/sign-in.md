# Sign In

Source: /#/typescript/x-redirect/JTI0ZSUyRkFjY291bnRzJTJGc2lnbklu

Signs in with an email address or a phone number, creating the account the first time. There's no password and no verification (sandbox). The response sets the `ot_session` cookie; shops created with it belong to the account and are listed on `/account`. Signing in with an email also claims older shops whose seller email matches. In a browser, sellers can instead use Log in with PayPal (`/api/account/paypal`), which also records the PayPal account their sales are paid into.

:information_source: **Note** This endpoint does not require authentication.

```ts
async signIn(
  body: ApiAccountSigninRequest,
  requestOptions?: RequestOptions
): Promise<ApiResponse<ApiAccountSigninResponse>>
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `body` | [`ApiAccountSigninRequest`](/llms-pages/typescript/models/structures/api-account-signin-request.md) | Body, Required | - |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: Signed in. The `ot_session` cookie is set.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`ApiAccountSigninResponse`](/llms-pages/typescript/models/structures/api-account-signin-response.md).


# Example Usage

```ts
const body: ApiAccountSigninRequest = {
  identifier: 'maker@example.com',
};

try {
  const response = await accountsApi.signIn(body);

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
  "id": "Vq3nN8cT0bLx2YwE",
  "email": "maker@example.com",
  "phone": null
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |



