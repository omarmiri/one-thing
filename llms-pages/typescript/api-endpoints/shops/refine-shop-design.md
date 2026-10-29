# Refine Shop Design

Source: /#/typescript/x-redirect/JTI0ZSUyRlNob3BzJTJGcmVmaW5lU2hvcERlc2lnbg

"Make it warmer", "shorter copy", "more premium". Gemini edits the design spec.

```ts
async refineShopDesign(
  slug: string,
  body: ApiShopsRefineRequest,
  requestOptions?: RequestOptions
): Promise<ApiResponse<ApiShopsRefineResponse>>
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `string` | Template, Required | The shop's link name (current or former). |
| `body` | [`ApiShopsRefineRequest`](/llms-pages/typescript/models/structures/api-shops-refine-request.md) | Body, Required | The design change, in words. |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: The new design.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`ApiShopsRefineResponse`](/llms-pages/typescript/models/structures/api-shops-refine-response.md).


# Example Usage

```ts
const slug = 'vintageskates';

const body: ApiShopsRefineRequest = {
  instruction: 'Make it feel more premium',
};

try {
  const response = await shopsApi.refineShopDesign(
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
    if (error instanceof ErrorResponseError) {
      console.log(error.result);
    }
  }
}
```


# Example Response *(as JSON)*

```json
{
  "spec": {
    "productType": "physical",
    "productName": "Vintage Cream and Red Roller Skates",
    "layout": "editorial",
    "palette": {
      "background": "#f6efe4",
      "surface": "#fffaf2",
      "text": "#2b1d14",
      "muted": "#7a6455",
      "accent": "#b3261e",
      "accentText": "#ffffff"
    },
    "fonts": {
      "heading": "Playfair Display",
      "body": "Inter"
    },
    "eyebrow": "One pair, restored",
    "headline": "Classic quad skates crafted with walnut burl heels",
    "subheadline": "A vintage pair of skates featuring cream leather, bold red trim, and durable quad wheels.",
    "story": "Each pair combines soft cream leather with distinct red accents and a sculpted walnut burl heel base.",
    "bullets": [
      "Handmade cream leather upper with rich red trim",
      "Sculpted walnut burl heel structure for stability"
    ],
    "details": [
      {
        "label": "Materials",
        "value": "Leather upper, walnut burl heel, rubber wheels"
      }
    ],
    "faq": [
      {
        "q": "Are these suitable for outdoor skating?",
        "a": "Yes, on indoor rink floors and paved outdoor paths."
      }
    ],
    "ctaLabel": "Buy the skates",
    "suggestedPriceUsd": 240,
    "suggestedShippingUsd": 15,
    "imageAlt": "Cream leather quad roller skates with red trim"
  }
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`ErrorResponseError`](/llms-pages/typescript/models/exceptions/error-response.md) |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`ErrorResponseError`](/llms-pages/typescript/models/exceptions/error-response.md) |
| 429 | Over this network's cap for the call (see **Limits**). Retry after `Retry-After` seconds. | [`ErrorResponseError`](/llms-pages/typescript/models/exceptions/error-response.md) |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`ErrorResponseError`](/llms-pages/typescript/models/exceptions/error-response.md) |



