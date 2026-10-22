# Errors and limits

## Error responses

Every error is JSON with a sentence you can show to a person:

```json
{ "error": "Photo must be an image under 8 MB.", "field": "photo" }
```

| Field | Meaning |
|---|---|
| `error` | What went wrong, written for the seller or buyer |
| `field` | The request field at fault, when there is one (handy for highlighting a form input) |
| `detail` | The upstream service's own message (Gemini, PayPal), for debugging only |

## Status codes

| Code | Meaning | What to do |
|---|---|---|
| 400 | Something in the request needs fixing, or a step is missing (e.g. going live before uploading the file) | Show `error`; fix and resend |
| 404 | No such shop, or the admin token doesn't match it | Check the slug and `x-admin-token` |
| 409 | Taken or unavailable: a link name in use, a sold-out product or size. From `captureCheckoutOrder`: the buyer hasn't approved yet | Pick another; or keep polling capture |
| 410 | Gone: a download link that's used up or expired, or the last unit sold while the buyer was paying (they aren't charged) | Tell the buyer; nothing to retry |
| 422 | The buyer's card or PayPal funding was declined | Let them try another way to pay |
| 502 | Gemini, PayPal or Channel3 failed | Retry after a few seconds |
| 503 | That service isn't set up on this server | Not retryable |

Calls are safe to repeat where it matters: capturing an order that's already paid answers 200
again, and stock is only taken once per order.

## Limits

| What | Limit |
|---|---|
| Photo sent to `createShop` | 8 MB |
| Each photo sent to `addPhotos` | 15 MB |
| Photos per shop | 8 |
| Digital file | 25 MB |
| Price | $0.50 – $10,000 (USD) |
| Shipping | $0 – $500 |
| Buyer options | 3 per shop (e.g. size, colour), 12 values each, 60 combinations |
| Download link | 5 downloads within 14 days |
| `refineShopDesign` instruction | 500 characters |
| `searchProducts` | 12 results |
| MCP `search_shops` | 25 results |

## Timing

- `createShop` takes 15–40 seconds while Gemini designs the page. Hero art is made afterwards:
  poll `getShop` until `hero_status` is `ready` or `failed`.
- Gemini calls (`createShop`, `refineShopDesign`, `checkMissingDetails`, `matchColorPhotos`) can
  answer 502 when the model is busy. Wait a few seconds and send the same request again.
