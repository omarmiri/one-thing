# OneThing — hackathon plan (working draft)

(Formerly "OneThing". Renamed Oct 20; repo: https://github.com/omarmiri/one-thing)

Target: **PayPal AI Hackathon — "Build what's next with PayPal and AI"** (Devpost)
https://paypalaihackathon.devpost.com/

## 1. The hackathon, in brief

| | |
|---|---|
| Submission deadline | **Nov 12, 2026, 12:00 pm PST** (about 3 weeks from Oct 20) |
| Judging / winners | Dec 1–15 / Dec 21 |
| Hard requirement | Must *meaningfully* use **both PayPal (sandbox OK) and AI** |
| Tracks | None. Open-ended |
| Total prizes | ~$69,750 |

**Submit:** a text description; a **working** demo (hosted URL, or setup steps judges can run; mockups don't count); the tools used and how; a **public repo with a LICENSE**; and a **public YouTube video under 3 minutes**.

**Judging:** Technological Implementation · Design (a complete product, not a PoC) · Potential Impact (a real problem for a real audience) · Innovation · Presentation (the video shows it end to end).

**Prizes that fit OneThing:**
- 1st / 2nd / 3rd overall: $12k / $8k / $5k
- **Best Use of Agentic Commerce**: $5k
- **Best Use of PayPal + AI**: $5k
- Most Creative / Most Impactful / Best Demo Delivery: $5k each
- **Best Use of Channel3**: $1.5k (1 winner). Must actually call the API or MCP, not just mention it
- **Best Use of AG Grid**: $5k / $2k / $1k×3. The seller dashboard is a natural fit
- **Best Use of Render**: $1k / $750 / $500 in credits. We need hosting anyway
- **Best Use of APIMatic**: $1k×3 plus 6 months Business. Their Context Plugin feeds PayPal API docs to Claude Code while we build

**Sponsor tools: use every one that actually fits.** Judges score "best use", and a tool that's only mentioned doesn't count.

| Sponsor | Fits? | How OneThing uses it | When |
|---|---|---|---|
| Render | Yes | Hosting + Postgres (`render.yaml`). Later, Render Workflows run shop generation and hero art as jobs | Week 1 / 2 |
| AG Grid | Yes | Seller's orders grid. Week 2 adds commissions and payouts grids | Week 1 ✓ |
| Postman | Yes | Collection for the whole API (`postman/`). Later, publish it as a public workspace | Week 1 ✓ |
| Zapier | Yes | Per-shop Catch Hook on paid and shipped orders (Sheets, Slack, labels) | Week 1 ✓ |
| Channel3 | Yes | Optional referral mode + "goes great with" add-ons, with commissions paid out through PayPal Payouts | Week 2 |
| APIMatic | Yes | Context Plugin for PayPal APIs in Claude Code while building. Claim the free month and say so in the write-up | Now (dev tool) |
| KERNEL | Yes, for the demo | Cloud browser where an AI shopping agent visits a OneThing shop and checks out. This is the Agentic Commerce demo | Week 3 |
| Elastic | Maybe | Search across all live shops ("discover OneThing shops") with vector search, or grounding for the buyer concierge | Stretch |
| Astropods | Maybe | Host the seller copilot agent with observability. Overlaps with running it ourselves | Stretch |
| Bryntum | No | Scheduling/Gantt components. Nothing in a one-product shop needs them, and forcing it would read as box-ticking | Skip |

**Sponsor freebies:** Channel3 gives 20k credits with promo `PAYPAL-HACKATHON-2026`. Render gives $50, KERNEL $50, Elastic a 14-day trial, and Zapier a 14-day Pro trial.

## 2. Use case

**Problem:** someone with *one* thing to sell (a handmade item, an ebook, a preset pack, a local service) doesn't need Shopify. Today they glue together Carrd, a PayPal button, and copy they write themselves. Gumroad and Stan Store take a cut and look generic.

**OneThing:** upload a photo and a sentence. About 60 seconds later you have a live, good-looking landing page with PayPal checkout. AI writes the copy, the FAQ and the pricing suggestion, and answers buyer questions.

**"No product? Sell one anyway" (Channel3):** the creator describes their audience ("trail runners on a budget"). The AI searches Channel3's 100M+ products and proposes a pick with a curated review page. The creator earns a commission when a buyer purchases through the link.

### Differentiators (needed for the Innovation score)
1. **Photo to live store in one step.** The AI does everything; the seller only approves.
2. **Every shop is agent-ready.** Each microsite has a buyer-concierge chat *and* a machine-readable endpoint, so AI shopping agents can find the product and pay through PayPal. This is the "Agentic Commerce" prize angle.
3. **Seller copilot.** "How did I do this week?" "Refund Jane." "Send an invoice to my wholesale buyer." Built on the PayPal Agent Toolkit.
4. **Hybrid pages.** Your own product plus AI-picked Channel3 add-ons ("goes great with…"), so even small shops earn on more than one item.

## 3. Channel3 referral mode (optional add-on)

The core product is **bring your own product**. Channel3 is an optional extra: a seller with no product, or one who wants more to offer, can refer customers to Channel3's partner stores and earn a referral fee.

Two details from Channel3's docs shape how it's built:
- Referral purchases happen **on the retailer's site**, so PayPal isn't in that checkout. The PayPal-checkout sale stays the main thing.
- Commissions go to **the developer account (OneThing)**, paid out via **Stripe**, not to each seller. So OneThing tracks referrals with Channel3's Reporting API and pays each seller their share with **PayPal Payouts**. That keeps PayPal in this mode too.

## 4. Architecture

```
Seller (web) ──► OneThing app (Next.js on Render)
                   ├─ AI: Gemini (vision → design spec + copy; image gen → hero art; concierge chat; seller copilot)
                   ├─ PayPal: JS SDK v6 Checkout + Orders API (sandbox), Webhooks,
                   │          Payouts (affiliate earnings), Invoicing/Refunds via Agent Toolkit
                   ├─ Channel3: product search (no-product mode + add-on recs), Reporting API
                   ├─ Postgres (Render) — shops, products, orders, payouts
                   └─ Render Workflows — async "generate my shop" job
Buyer ──► <app>/s/<slug>  (static-fast page + chat + PayPal buttons)
AI agent ──► /<slug>/agent  (product JSON + MCP endpoint: get_product, create_order)
```

**How sellers get paid (decide this early):**
- *Hackathon path (recommended):* each seller enters their PayPal email. Orders set `purchase_units[].payee` to the seller, so money goes straight to them and OneThing never holds funds. This works in sandbox today.
- *Upgrade: "Connect PayPal" onboarding (Partner Referrals API).* OneThing calls `POST /v2/customer/partner-referrals`, prefilled with the seller's email and shop name, and gets back an `action_url`. The seller opens it, logs in to PayPal or signs up (prefilled), and grants consent. PayPal then redirects back with their `merchantIdInPayPal`, and sends `MERCHANT.ONBOARDING.COMPLETED` by webhook. Orders then use `payee.merchant_id` and can take a `platform_fees` cut, sent with the `PayPal-Partner-Attribution-Id` header. **The seller still has to click through and consent:** no API creates a PayPal account silently on someone's behalf, for KYC reasons. Sandbox lets us build and demo it. Live use needs PayPal to approve OneThing as a partner. The schema already has `paypal_merchant_id`, and `createOrder` prefers it over the email. *Do this in week 2*, after confirming that partner referrals work on our sandbox app.

### AI site design (Gemini)

Gemini, using your API key, designs each microsite. We have it return a **design spec**, not raw HTML. Our own templates render that spec, and the code always inserts the PayPal button itself. Gemini never writes it.

1. **Analyse:** Gemini vision reads the product photo and the seller's sentence. It works out the product type, audience, mood and the photo's colours.
2. **Design:** a Gemini call with structured output (a JSON schema) returns:
   - colour palette, font pair, layout choice ("bold hero", "editorial", "minimal", "playful"), and section order
   - copy: headline, story, bullets, FAQ, suggested price, and the type-specific details (shipping / "what's inside")
3. **Art:** a Gemini image model creates a hero background or a lifestyle scene from the seller's photo. (Check which image models your key has access to.)
4. **Iterate:** the seller types a change ("make it warmer", "more premium", "shorter copy"). Gemini edits the spec, and the preview updates immediately.

Why a spec instead of letting Gemini write HTML:
- The page always works on phones and loads fast.
- No AI-written script ends up on a page that takes payments.
- PayPal checkout can't be broken by a bad generation.
- Re-theming is cheap, since only the JSON changes.

**API key:** it lives only in server env vars (`.env.local` locally, Render env vars in production). It is never sent to the browser and never committed. `.env` goes in `.gitignore` before the first commit, because the repo has to be public.

Gemini can also run the concierge chat and the seller copilot, so the whole project uses one AI provider. Before relying on the PayPal Agent Toolkit with Gemini, check which agent frameworks the toolkit supports (e.g. whether the Vercel AI SDK with its Google provider works). Otherwise, wrap the toolkit's tools as Gemini function calls.

### Product types: digital and physical, both from day 1

The AI guesses the type from the photo and description ("a PDF guide" vs "a ceramic mug"), and the seller confirms it. Both types share the same page, checkout and order record. They differ only in what happens after payment:

| | Digital | Physical |
|---|---|---|
| Seller provides | File upload (or a link, or a service booking note) | Price, shipping price (flat, or free above $X), countries shipped to, stock count |
| PayPal order | `shipping_preference: NO_SHIPPING` | `GET_FROM_FILE`. PayPal collects the buyer's address, and it comes back on capture |
| After capture | Expiring signed download link on the thank-you page and in the email (e.g. 3 downloads, 7 days) | Order shows "to ship" with the address. Seller adds a tracking number, which is pushed to PayPal's tracking API so the buyer sees it in PayPal |
| Stock | Unlimited | Decremented on capture. The page shows "sold out" at zero |
| Copilot | "Resend Jane's download link" | "What do I need to ship today?" / "Mark order 12 shipped, UPS 1Z…" |
| AI extras | Writes "what's inside" bullets | Writes dimensions, materials and care notes, and suggests a shipping price from weight and size |

Data model: `products.type ('digital' | 'physical')`, plus `digital_assets` (storage key, download limits) and physical fields (`shipping_cents`, `ship_countries`, `stock`). `orders` gets `shipping_address`, `fulfillment_status` and `tracking_number`.

Video: show one of each. The main demo is a physical item (photo → shop → PayPal with an address), plus a quick digital download sale.

## 5. Build outline (about 3 weeks)

**Week 1 — core loop (must work end to end)** (scaffolded Oct 20; see README)
- [x] Repo, LICENSE (MIT), Next.js 16 + Postgres (PGlite locally), `render.yaml`
- [ ] Deploy to Render (needs your Render account + env vars)
- [ ] PayPal sandbox app, business and buyer test accounts → `.env.local`
- [x] Seller onboarding: photo + description → Gemini → design spec → rendered shop (4 layouts, contrast check, background hero art)
- [x] Manage page: live preview, chat-to-redesign, settings, publish
- [x] PayPal JS SDK v6 checkout, Orders create/capture (payee = seller), verified webhook, thank-you page. Confirmation email still to do
- [x] Digital: file upload, private download link (5 uses / 14 days). Physical: PayPal-collected address, stock, "to ship" list in AG Grid, tracking pushed to PayPal
- [x] Zapier hook per shop, Postman collection
- [ ] Verify with real keys: Gemini models on your key, a sandbox sale end to end, tracking sync on an email-payee order

**Week 2 — AI and sponsors**
- [ ] ~~Buyer concierge chat on each shop, grounded in the product data, that can start checkout~~ (dropped Oct 21)
- [ ] ~~Seller copilot via the PayPal Agent Toolkit (transactions, refunds, invoice, tracking)~~ (dropped Oct 21)
- [ ] Channel3: "no product" mode (audience → picks → review page) and "goes great with" add-ons
- [ ] ~~Commission ledger plus **PayPal Payouts** of creator earnings~~ (dropped Oct 21)
- [ ] Seller dashboard: orders, commissions and payouts in **AG Grid**

**Week 3 — agentic commerce, polish, submission**
- [ ] Agent endpoint per shop (product JSON + MCP `create_order`). Demo: an AI shopping agent finds a shop and buys through PayPal
- [ ] Design polish: 3–4 AI-chosen themes, mobile-first
- [ ] README: setup steps, sandbox test-buyer credentials, tools used
- [ ] Demo video under 3 minutes (script below), Devpost write-up, submit **by Nov 11** (a day of buffer)

**Cut list if time runs short (cut from the bottom):** AG Grid → agent endpoint → hybrid add-ons. Never cut: the photo-to-shop-to-PayPal-sale loop.

## 6. Demo video script (under 3 minutes)
1. 0:00 Problem: one product, ten tools. (15 s)
2. 0:15 Snap a photo → live shop in 60 s. (40 s)
3. 0:55 Buyer asks the concierge a question → pays with PayPal sandbox. (35 s)
4. 1:30 Seller copilot: "how'd I do?" / "refund that order." (25 s)
5. 1:55 No product? Channel3 picks → commission → PayPal Payout. (30 s)
6. 2:25 An AI agent buys from a shop on its own. (25 s)
7. 2:50 Close.

## 7. Open questions
- Solo or team?
- Stack preference (Next.js assumed)?
- Is the name final? (Check the domain.)

## 8. Next features (planned Oct 20)

**Oct 21: dropped earnings/Payouts, subscriptions, the buyer concierge chat, one-time-code sign-in, the seller copilot and the platform fee. No new features are planned; what's left is polish and the demo.** Sections C below and the Payouts parts of B are kept only for the record.

Build order: **games → earnings ledger + Payouts → Channel3 → subscriptions**. Channel3 and subscriptions both pay sellers through the same ledger and PayPal Payouts, so that piece is built once and comes first.

### A. Demo products: Raptor Rush and Dragon Flight (your games)
The point is to have real products in the demo, sold by a real seller.
- **New ways to deliver a digital product.** Today it's only `file`. Add:
  - `link`: the buyer gets an access URL after paying.
  - `license_key`: a unique key per order, plus `GET /api/licenses/verify?shop=&key=` so a game can check it and unlock premium content.
- **Seed script** (`scripts/seed-demo.mjs`): creates both shops through the API with real screenshots and art from the game repos, so a fresh Render database always has the demo shops.
- **Open question: what does a buyer actually get?** For example a premium unlock key, a downloadable build (APK or desktop zip), or a supporter pack. If it's a key the game checks, the change to each game belongs in that game's repo, not this one.

### B. Channel3: find a product, pick it, earn referrals
1. `/new` gets a third choice: **"I don't have a product — find one."** The seller describes a niche, e.g. "gifts for trail runners under $60".
2. Gemini turns that into 2–3 Channel3 searches with filters such as price. Channel3's own "agentic search" endpoint, which takes long requests, is the alternative.
3. The server calls `POST https://api.trychannel3.com/v1/search` with `x-api-key` and **`x-user-id: <shop id>`**. Channel3 stamps that id on every buy link, so clicks and commissions are credited to that seller.
4. The seller sees result cards (image, title, price, retailer, `max_commission_rate`, shown as "earn up to X%") and picks one.
5. Gemini designs a recommendation page from Channel3's product data, using the same design spec and templates. The new `product_type: 'referral'` has a **Buy at <retailer>** button that uses Channel3's tracked buy link. There's no PayPal checkout on this page.
6. **Earnings:** the Reporting API (`/v1/reporting/transactions?user_id=<shop id>`, which returns net commission) feeds an `earnings` table. The seller sees it in AG Grid and clicks **Pay out**, which sends their share with **PayPal Payouts** (sandbox).
   - Retailer purchases won't happen during a demo, so add a clearly labelled "simulate a referral sale" button for the video.
7. Credits: the hackathon key gets 20,000 searches with code `PAYPAL-HACKATHON-2026`.

Schema: `shops.product_type` gains `'referral'`, plus `channel3_product jsonb` and `buy_url`. New tables:
- `earnings`: id, shop_id, source (`channel3` | `subscription`), amount, status (`pending` | `paid`), payout_batch_id
- `payouts`: one row per Payouts batch

### C. Subscriptions
**Constraint from PayPal's docs:** subscriptions that pay the *seller's* account directly ("platform" subscriptions) are open to **select partners only**. They need seller onboarding and a `PayPal-Auth-Assertion` header on every call. So:
- **Hackathon approach (works in sandbox now):**
  - Plans live in OneThing's own PayPal account: Catalog Products API → Billing Plans API (monthly or yearly, optional free trial).
  - The buyer subscribes with the **JS SDK v5** subscription button. PayPal documents subscriptions for v5 only, so only subscription shops load v5, and other shops keep v6.
  - Webhooks: `BILLING.SUBSCRIPTION.ACTIVATED / CANCELLED / SUSPENDED` and `PAYMENT.SALE.COMPLETED`. Each payment adds a row to the **earnings** ledger, minus a platform fee (e.g. 5%), and sellers are paid by Payouts, the same pipeline as Channel3.
- **Delivery:** the subscriber gets an access page or license key that stays valid while the subscription is `ACTIVE`, plus a link to cancel in PayPal.
- **Production approach:** Partner Referrals onboarding plus `PayPal-Auth-Assertion`, so plans live in the seller's own account and OneThing never holds money. The hackathon approach briefly holds funds between payment and payout, which is fine in sandbox but is a legal question in production. Say so in the write-up.
- Schema: `shops.billing` (`one_time` | `subscription`), `interval`, `trial_days`, `paypal_product_id`, `paypal_plan_id`. New `subscriptions` table: id, shop_id, paypal_subscription_id, status, buyer, access_token, next_billing_at.
- Seller UI: "per month / per year" and an optional trial. Gemini's copy adapts ("$2.99/month, cancel anytime").
- Fits the games well: e.g. **"Raptor Rush Pass, $2.99/mo"** unlocks premium dinos for as long as the subscription is active.
