# Create Shop

Source: /#/typescript/x-redirect/JTI0ZSUyRlNob3BzJTJGY3JlYXRlU2hvcA

Starts a draft shop from one of three sources. Gemini designs the page and guesses the
setup; check it with `getShop`, adjust with `updateShop`, then go live.

Sent with a session cookie from `signIn`, the shop belongs to that account, which also
becomes its seller email (and PayPal email, after Log in with PayPal) unless you give one.

- `source=photo`: a `photo` and/or a `description` of your own product.
- `source=link`: a `url`. If Channel3 recognises it as a store's product page, the shop
  becomes a recommendation (`product_type: referral`); otherwise the page is read and you
  sell the product yourself with PayPal.
- `source=channel3`: a `productId` from `searchProducts` (a recommendation).

Takes 15–40 seconds. Hero art, if available, is generated afterwards (`hero_status`).

**Platforms:** sent with a platform API key, the shop belongs to the key's account, so the
key can manage it from then on (no need to keep the admin token). It's made for one of the
platform's sellers, so it inherits nothing from the account: set `paypal_email` or call
`connectPayPal` for that seller.

```ts
async createShop(
  source: Source,
  photo?: FileWrapper,
  description?: string,
  url?: string,
  productId?: string,
  slug?: string,
  type?: Type,
  delivery?: Delivery,
  accessUrl?: string,
  price?: number,
  shipping?: number,
  stock?: number,
  shipCountries?: string,
  paypalEmail?: string,
  sellerEmail?: string,
  digitalFile?: FileWrapper,
  requestOptions?: RequestOptions
): Promise<ApiResponse<CreatedShop>>
```


# Authentication

This endpoint requires [PlatformKey](/llms-pages/typescript/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `source` | [`Source`](/llms-pages/typescript/models/enumerations/source.md) | Form, Required | - |
| `photo` | `FileWrapper \| undefined` | Form, Optional | `source=photo`: the product photo, up to 8 MB. |
| `description` | `string \| undefined` | Form, Optional | `source=photo`: a sentence or two about the product. Required if there is no photo. |
| `url` | `string \| undefined` | Form, Optional | `source=link`: a product page, or your own app or game page. |
| `productId` | `string \| undefined` | Form, Optional | `source=channel3`: a product id from `searchProducts`. |
| `slug` | `string \| undefined` | Form, Optional | The link name you want. If omitted, the AI suggests one. |
| `type` | [`Type \| undefined`](/llms-pages/typescript/models/enumerations/type.md) | Form, Optional | **Default**: `Type.Auto` |
| `delivery` | [`Delivery \| undefined`](/llms-pages/typescript/models/enumerations/delivery.md) | Form, Optional | For digital products. If omitted, the AI guesses. |
| `accessUrl` | `string \| undefined` | Form, Optional | Where buyers use an access code. |
| `price` | `number \| undefined` | Form, Optional | USD. If omitted, the AI suggests a price. |
| `shipping` | `number \| undefined` | Form, Optional | - |
| `stock` | `number \| undefined` | Form, Optional | - |
| `shipCountries` | `string \| undefined` | Form, Optional | - |
| `paypalEmail` | `string \| undefined` | Form, Optional | - |
| `sellerEmail` | `string \| undefined` | Form, Optional | - |
| `digitalFile` | `FileWrapper \| undefined` | Form, Optional | - |
| `requestOptions` | `RequestOptions \| undefined` | Optional | Pass additional request options. |


# Response Type

**200**: Draft created.

This method returns an [`ApiResponse`](/llms-pages/typescript/sdk-infrastructure/utilities/apiresponse.md) instance. The `result` property of this instance returns the response data which is of type [`CreatedShop`](/llms-pages/typescript/models/structures/created-shop.md).


# Example Usage

```ts
const source = Source.Photo;

const description = 'Vintage cream and red quad roller skates with walnut burl heels.';

const type = Type.Physical;

const price = 240;

const shipping = 15;

const shipCountries = 'US';

const paypalEmail = 'seller@example.com';

try {
  const response = await shopsApi.createShop(
    source,
    undefined,
    description,
    undefined,
    undefined,
    undefined,
    type,
    undefined,
    undefined,
    price,
    shipping,
    undefined,
    shipCountries,
    paypalEmail
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
  "slug": "vintageskates",
  "token": "3fJ9xQm2LwP8vR1tZk7cN4bY6dHs0aEu",
  "manageUrl": "/manage/vintageskates?token=3fJ9xQm2LwP8vR1tZk7cN4bY6dHs0aEu"
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |
| 409 | Taken or unavailable (a link name, or a sold-out product). | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |
| 429 | Over this network's cap for the call (see **Limits**). Retry after `Retry-After` seconds. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`CustomError`](/llms-pages/typescript/models/exceptions/error.md) |



