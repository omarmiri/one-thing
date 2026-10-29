# Check Missing Details

Source: /#/http/x-redirect/JTI0ZSUyRlNob3BzJTJGY2hlY2tNaXNzaW5nRGV0YWlscw

Asks Gemini what buyers will want to choose (sizes, colours) and what they'll ask that the
listing doesn't say (dimensions, materials). `createShop` already does this once; call it
again after editing the product. The result is saved as the shop's `suggestions`.

Nothing changes on the shop page until the seller confirms: save options with `updateShop`
(`options`), and answer the questions with `updateShop` (`facts`). Not for recommendations.

```http
POST /api/shops/{slug}/suggest
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/http/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/http/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `String` | Template, Required | The shop's link name (current or former). |


# Response Type

**200**: The suggestions.

[`Suggestions`](/llms-pages/http/models/structures/suggestions.md)


# Example Usage

```bash
curl -X POST \
  --url 'https://one-thing-ash0.onrender.com/api/shops/raptorrush/suggest'  \
  -H 'Accept: application/json' \
  -H 'x-admin-token: x-admin-token' \
  -H 'Authorization: Bearer AccessToken'
```


# Example Response *(as JSON)*

```json
{
  "oneOfAKind": false,
  "options": [
    {
      "name": "Size",
      "kind": "size",
      "values": [
        {
          "label": "7"
        },
        {
          "label": "8"
        },
        {
          "label": "9"
        }
      ],
      "fromSeller": false
    }
  ],
  "missingFacts": [
    {
      "label": "Wheel size",
      "question": "How big are the wheels?",
      "placeholder": "57 mm"
    }
  ]
}
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 400 | Something in the request needs fixing; `error` says what. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |
| 429 | Over this network's cap for the call (see **Limits**). Retry after `Retry-After` seconds. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |
| 502 | Gemini, PayPal or Channel3 failed or isn't configured. | [`Error_ErrorException`](/llms-pages/http/models/exceptions/error-error.md) |



