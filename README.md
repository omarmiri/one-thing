# micro-shop

**Sell your one thing in about a minute.** Upload a photo and a few sentences. Gemini designs a
one-product landing page and writes the copy. PayPal takes the payments, which go straight to the
seller's PayPal account. Works for physical products (PayPal collects the shipping address, and
tracking numbers are pushed back to PayPal) and digital ones (buyers get a private download link).

Built for the [PayPal AI Hackathon](https://paypalaihackathon.devpost.com/).

## Run it locally

Requires Node 22.9+. No database install: without `DATABASE_URL`, it uses PGlite (Postgres compiled
to WASM, stored in `node_modules/.cache`).

```bash
npm install
cp .env.example .env.local   # add your keys (all optional for a first look)
npm run dev                  # http://localhost:3000
```

With no keys, the whole flow still runs, with placeholder copy and checkout disabled. To get the
full experience:

| Key | Where | What it unlocks |
|---|---|---|
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/apikey) | AI design, copy, hero art, chat edits. `npm run gemini:models` lists the models your key can use |
| `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET` | [PayPal developer dashboard](https://developer.paypal.com/dashboard/applications/sandbox) → Sandbox app | Checkout |
| `PAYPAL_WEBHOOK_ID` | Same app → Webhooks → `<APP_URL>/api/paypal/webhook`, event `PAYMENT.CAPTURE.COMPLETED` | Confirms payments if the buyer closes the tab mid-checkout (needs a public URL) |

### Try a sale (sandbox)
1. In the PayPal dashboard, under Sandbox → Accounts, note a **business** account email (the
   seller) and a **personal** account (the buyer).
2. Create a shop and enter the business email as "Your PayPal email". Publish it.
3. Open the shop link and pay with the personal sandbox account. You land on the thank-you page
   (with a download button for digital products), and the order appears in the seller's grid.
4. For a physical order, click **Mark shipped** and add a tracking number.

## Deploy to Render

`render.yaml` is a Blueprint: in Render, choose **New → Blueprint** and pick this repo. It creates
the web service and a Postgres database, then asks for the secret env vars. Set `APP_URL` to the
service URL.

## How it works

```
Seller ── /new ──► POST /api/shops ──► Gemini (vision + structured output) ──► design spec (JSON)
                                    └► after(): Gemini image model ──► hero art
           /manage/[slug] ── chat "make it warmer" ──► POST /refine ──► Gemini edits the spec
Buyer  ── /s/[slug] ── <paypal-button> (JS SDK v6)
           ├► POST /api/orders                    → PayPal Orders v2 create (price from DB, payee = seller)
           └► POST /api/orders/:id/capture        → capture → mark paid → stock / download link / Zapier
PayPal ──► POST /api/paypal/webhook               → signature verified → same idempotent mark-paid
```

- **Gemini returns a design spec, never HTML** ([src/lib/design.ts](src/lib/design.ts)). The spec
  covers layout (4 options), palette, font pair, headline, story, bullets, details, FAQ and a
  suggested price. Our templates ([src/components/shop/ShopPage.tsx](src/components/shop/ShopPage.tsx))
  render it, and our code always places the PayPal button. So a bad generation can't break
  checkout or inject script, and a contrast check keeps every palette readable.
- **Money goes straight to sellers**: the order's `payee` is the seller's PayPal account, so
  micro-shop never holds funds.
- **Mark-paid is idempotent** ([src/lib/orders.ts](src/lib/orders.ts)). The capture call and the
  webhook can arrive in either order, and stock, download tokens and Zapier still fire exactly once.

## Tools used

| Tool | How it's used |
|---|---|
| **PayPal** JS SDK v6, Orders v2 (create/capture, payee routing, shipping preference), order tracking API, webhooks | All checkout and payment handling |
| **Google Gemini** (`@google/genai`) | Reads the product photo; generates the structured design spec and copy; edits it from chat; image model makes the hero art |
| **Render** | Hosting and Postgres via `render.yaml` |
| **AG Grid** | The seller's orders table (sort, filter, search, mark shipped) |
| **Zapier** | Optional per-shop Catch Hook: every paid or shipped order is posted to it, for Sheets, Slack, label printing |
| **Postman** | [postman/micro-shop.postman_collection.json](postman/micro-shop.postman_collection.json) covers the whole API |
| Next.js 16, PostgreSQL / PGlite, Tailwind, zod | App framework and data |

## License

MIT. See [LICENSE](LICENSE).
