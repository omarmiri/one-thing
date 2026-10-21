# OneThing

**Sell your one thing in about a minute.** Start from a photo, a link, or a product you'd
recommend. Gemini works out what it is, how it's delivered, what to charge, and designs a
one-product landing page. PayPal takes the payments, which go straight to the seller's PayPal
account.

Built for the [PayPal AI Hackathon](https://paypalaihackathon.devpost.com/).

| | |
|---|---|
| **Live app** | [one-thing-ash0.onrender.com](https://one-thing-ash0.onrender.com) (PayPal sandbox) |
| **Make a shop** | [one-thing-ash0.onrender.com/new](https://one-thing-ash0.onrender.com/new) |
| **Example shop** | [one-thing-ash0.onrender.com/raptorrush](https://one-thing-ash0.onrender.com/raptorrush): Raptor Rush, a browser game sold with access codes |
| **API docs and SDKs** | [omarmiri.github.io/one-thing](https://omarmiri.github.io/one-thing/), generated with APIMatic, with working "Try it" calls |
| **OpenAPI spec** | [one-thing-ash0.onrender.com/openapi.yaml](https://one-thing-ash0.onrender.com/openapi.yaml) |

## Why

Someone with *one* thing to sell (a handmade item, an ebook, a preset pack, a small game)
doesn't need Shopify. Today they glue together a page builder, a PayPal button and copy they
write themselves, or they pay Gumroad-style fees for a page that looks like everyone else's.

OneThing makes the whole shop from what the seller already has, and the seller only checks
the AI's guesses and clicks **Go live**. The choices behind it:

- **The AI guesses, the seller confirms.** One "what we guessed" panel (what it is, physical or
  digital, price, link name) beats a long form. Every guess can be corrected.
- **Gemini returns a design spec, never HTML.** Our templates render the spec and our code always
  places the PayPal button. A bad generation can't break checkout or put AI-written script on a
  page that takes payments, pages stay fast and mobile-friendly, and a contrast check keeps every
  palette readable. Re-theming only changes JSON.
- **Money goes straight to sellers.** Each PayPal order's `payee` is the seller's account, so
  OneThing never holds funds.
- **No product? Recommend one.** Through Channel3, a creator can turn a product they love into a
  recommendation page and earn a referral commission, with a clear disclosure on the page.

## Features

### Sellers

- **Three ways to start** at `/new`:
  - **Upload a photo** of your own product, with a sentence or two if you like.
  - **Paste a link.** A store product found by Channel3 becomes a recommendation; any other page
    is read (public addresses only, size- and time-capped) and its preview image becomes the photo.
  - **Find a product** with Channel3 search across 100M+ products, shown as "earn up to X%" cards.
- **AI guesses everything** in one pass: product name, physical or digital, price, a short link
  name, and the page design (one of 4 layouts, a palette taken from the photo, a curated font
  pair, headline, story, bullets, details and FAQ).
- **Hero art** made in the background by a Gemini image model. If the configured model isn't on
  the key, OneThing finds one that is, and records why if none works.
- **Chat to redesign** ("make it warmer", "shorter copy") with a live preview.
- **Short links the seller picks**, like `/raptorrush`, with a live availability check. Renamed
  shops keep their old links working (308 redirects).
- **A private manage page** (link with an admin token): settings, publish, and an
  [AG Grid](https://www.ag-grid.com/) orders table with sort, filter, search and **Mark shipped**.
- **Physical products:** PayPal collects the shipping address, stock counts down and shows "sold
  out" at zero, and tracking numbers are pushed to PayPal so buyers see them there.
- **Digital products**, delivered one of two ways:
  - **File:** a private download link per order (5 downloads, 14 days).
  - **Access code:** each order gets a code like `K7QF-M2XP-9HTD` and a **Start now** link into the
    seller's app or game, which checks the code with one API call.
- **PayPal webhook log** on the manage page: every delivery for the shop's orders, whether its
  signature verified, and what it changed.
- **Zapier:** paste a Catch Hook URL and every paid or shipped order is posted to it (Sheets,
  Slack, label printing).

### Buyers

- **PayPal checkout** with the JS SDK v6 buttons. The price always comes from the database, never
  the browser.
- **Pay on your phone:** desktop shop pages show a QR code, and payments that come back by
  redirect (as on mobile) are captured on the thank-you page.
- **Thank-you page** with the download button, the access code and its **Start now** link, or the
  shipping confirmation.

### Developers

- **A documented REST API** for everything the app does: [OpenAPI 3.1 spec](apimatic/src/spec/openapi.yaml),
  served live at `/openapi.yaml`.
- **SDKs and a docs portal** generated with APIMatic (TypeScript and Python), published at
  [omarmiri.github.io/one-thing](https://omarmiri.github.io/one-thing/). See
  [apimatic/README.md](apimatic/README.md).
- **Postman collection:** [postman/one-thing.postman_collection.json](postman/one-thing.postman_collection.json).
- **Access-code check for your own app:** `POST /api/access/verify` with `{ shop, code }` answers
  `{ valid }`, from any origin. Raptor Rush on miriogames.com uses it to unlock the game.

## Try a sale (sandbox)

1. In the [PayPal developer dashboard](https://developer.paypal.com/dashboard/accounts), under
   Sandbox → Accounts, note a **business** account email (the seller) and a **personal** account
   (the buyer).
2. Create a shop at [/new](https://one-thing-ash0.onrender.com/new) and enter the business email as
   "Your PayPal email". Go live.
3. Open the shop link and pay with the personal sandbox account. You land on the thank-you page,
   and the order appears in the seller's grid.
4. For a physical order, click **Mark shipped** and add a tracking number.

## How it works

```
Seller ── /new ──► POST /api/shops ──► Gemini (vision + structured output) ──► design spec (JSON)
          (photo │ link │ Channel3 pick)  └► after(): Gemini image model ──► hero art
          /manage/[slug] ── chat "make it warmer" ──► POST /refine ──► Gemini edits the spec
Buyer  ── /<slug> ── <paypal-button> (JS SDK v6), or a QR code to pay on a phone
          ├► POST /api/orders                    → PayPal Orders v2 create (price from DB, payee = seller)
          └► POST /api/orders/:id/capture        → capture → mark paid → stock / download / access code / Zapier
PayPal ──► POST /api/paypal/webhook               → signature verified → same idempotent mark-paid → webhook log
Seller's app ──► POST /api/access/verify          → is this buyer's code valid for my shop?
```

- **Design spec:** [src/lib/design.ts](src/lib/design.ts) defines it; [src/lib/gemini.ts](src/lib/gemini.ts)
  asks for it; [src/components/shop/ShopPage.tsx](src/components/shop/ShopPage.tsx) renders it.
- **Mark-paid is idempotent** ([src/lib/orders.ts](src/lib/orders.ts)). The capture call and the
  webhook can arrive in either order, and stock, download links, access codes and Zapier still fire
  exactly once. Capture request ids are unique per attempt, so a retry after a decline isn't replayed.
- **Channel3** ([src/lib/channel3.ts](src/lib/channel3.ts)): every request carries the shop's id as
  `x-user-id`, so Channel3 credits clicks and commissions on its buy links to that shop.

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
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/apikey) | AI guesses, design, copy, hero art, chat edits. `npm run gemini:models` lists the models your key can use |
| `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET` | [PayPal developer dashboard](https://developer.paypal.com/dashboard/applications/sandbox) → Sandbox app | Checkout |
| `PAYPAL_WEBHOOK_ID` | Same app → Webhooks → `<APP_URL>/api/paypal/webhook`, event `PAYMENT.CAPTURE.COMPLETED` | Confirms payments if the buyer closes the tab mid-checkout (needs a public URL) |
| `CHANNEL3_API_KEY` | [Channel3 developers](https://trychannel3.com/developers) | "Find a product", store-link lookup and recommendation shops |

## Deploy to Render

`render.yaml` is a Blueprint: in Render, choose **New → Blueprint** and pick this repo. It creates
the web service and a Postgres database, then asks for the secret env vars. Set `APP_URL` to the
service URL.

## Tools used

| Tool | How it's used |
|---|---|
| **PayPal** JS SDK v6, Orders v2 (create/capture, payee routing, shipping preference), order tracking API, webhooks | All checkout and payment handling |
| **Google Gemini** (`@google/genai`) | Reads the photo or page; guesses the product, delivery, price and link; generates the structured design spec and copy; edits it from chat; an image model makes the hero art |
| **Channel3** | Product search, store-link lookup, and recommendation shops that earn through Channel3's tracked buy links |
| **Render** | Hosting and Postgres via `render.yaml` |
| **AG Grid** | The seller's orders table (sort, filter, search, mark shipped) |
| **Zapier** | Optional per-shop Catch Hook: every paid or shipped order is posted to it |
| **APIMatic** | Generates the TypeScript and Python SDKs and the [docs portal](https://omarmiri.github.io/one-thing/) from the OpenAPI spec. Its PayPal Context Plugin gave Claude Code PayPal's API reference while building the PayPal features |
| **Postman** | A collection covering the whole API |
| Next.js 16, PostgreSQL / PGlite, Tailwind, zod | App framework and data |

## Roadmap

Planned, not built yet (details in [PLAN.md](PLAN.md)):

- **Buyer concierge chat** on each shop, grounded in the product, that can start checkout.
- **Seller copilot** on the PayPal Agent Toolkit: "how did I do this week?", refunds, invoices.
- **Earnings and PayPal Payouts**, so recommendation sellers get their share of Channel3 commissions.
- **Subscriptions**, such as a monthly pass that keeps an access code valid.
- **An agent endpoint per shop**, so AI shopping agents can find a product and pay through PayPal.
- **Connect PayPal** onboarding (Partner Referrals) instead of typing a PayPal email.

## License

MIT. See [LICENSE](LICENSE).
