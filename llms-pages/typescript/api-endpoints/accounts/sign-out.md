# Sign Out

Source: /#/typescript/x-redirect/JTI0ZSUyRkFjY291bnRzJTJGc2lnbk91dA

Ends this browser's session and clears the `ot_session` cookie.

:information_source: **Note** This endpoint does not require authentication.

```ts
async signOut(requestOptions?: RequestOptions): Promise<ApiResponse<Ok>>
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: Done.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`Ok`](/llms-pages/typescript/models/structures/ok.md).


# Example Usage

```ts
try {
  const response = await accountsApi.signOut();

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
  }
}
```


# Example Response *(as JSON)*

```json
{
  "ok": true
}
```



