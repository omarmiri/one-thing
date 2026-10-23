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

## 6. Demo video script (under 3 minutes, rewritten Oct 23)

Target 2:45. Voiceover (VO) in quotes; everything else is on screen. Cut every wait (Gemini's
15–40 s, PayPal redirects) to a jump or a 2× speed-up.

**1. Intro (0:00–0:10)**
- On screen: the finished shop page scrolling, then hard cut to a phone photo.
- VO: "You have one thing to sell. No store, no cart, no password with one uppercase, one number and one hieroglyph. Here's how long it takes with OneThing."

**2. Sign in (0:10–0:20)**
- `/account` → **Log in with PayPal** → PayPal sandbox sign-in → back, signed in.
- VO: "No new password. Sign in with PayPal."

**3. Upload a photo (0:20–0:50)**
- `/new` → drop in the product photo (a tee or mug in two colours shows the options well) → speed through the wait.
- The manage page appears: designed page, headline, price, link.
- VO: "One photo. Gemini works out what it is, writes the page, picks a price and a link, and designs it."
- Quick beats (2–3 s each):
  - **Buyers will ask** lists sizes, colours and the missing facts.
  - One chat refine: click "Make it feel more premium" and the page restyles.
- VO: "It even asks what buyers will want to know."

**4. Connect PayPal (0:50–1:10)**
- **Connect PayPal** → PayPal onboarding → Sign in with the sandbox business account → back to the checklist, all ticked → **Go live with PayPal**.
- VO: "Connect your PayPal business account once. Every sale goes straight to you."

**5. Show the shop and buy (1:10–1:40)**
- The live shop: scroll the feature story, swipe the gallery, open Inspect, pick a colour (the photo switches).
- **PayPal** button → sandbox buyer pays → thank-you page.
- Optional 2 s: the QR code for paying on a phone.
- Cut to the seller's orders grid: the order with the buyer's address → **Mark shipped** with a tracking number.
- VO: "Buyers pay with PayPal or a card. You see the order, add tracking, and PayPal shows it to the buyer."

**6. An AI assistant buys, no plugins (1:40–2:10)**
- Grok, with no plugins or connectors (Grok, Kimi K3 and Meta's Muse all completed this whole flow on Oct 23; Kimi is the backup. Muse went further and paid by itself, see the note under Lines). One prompt, pasted:
  "Read one-thing-ash0.onrender.com/llms.txt and find me a game under $10."
- 2× speed: it reads the file and lists the two games with prices: Dragon Flight ($4.99) and Raptor Rush ($9.99).
- You type "Buy Dragon Flight." It opens the order link and replies with a OneThing pay link (`/o/<order id>`). Nothing charged yet.
- Tap the link → PayPal sandbox → pay as the buyer (jump-cut through PayPal).
- You type "Paid." It checks the order, sees `paid`, and hands back the access code and a Start link. Tap Start: Dragon Flight plays.
- On screen, 2 s, as a caption: "No MCP. No plugin. No enrollment." Then a pull quote from Kimi, after its purchase: "I did the errands, you did the decision-making and the money part."
- Small caption under it: "Also bought here: Grok, Kimi K3, Meta's Muse, Claude."
- VO: "Shops are agent-legible. With no plugins, Grok reads one small text file, places the order and hands you a pay link. It runs the errands. The decision and the money stay with you, at PayPal."

**7. Create a product from the SDK (2:10–2:35)**
- miriogames.com/market/upload: a developer fills in title, price, the game file and a cover → **Upload** → the manage page appears with its store page made → **Connect PayPal** (skip through) → **Publish**.
- Split screen, 3 s: the market's server code calling the SDK, `shops.createShop(...)` and `shops.connectPayPal(slug, { returnUrl })`.
- Cut to the docs portal (omarmiri.github.io/one-thing), "Build a marketplace on OneThing".
- VO: "That marketplace is built on OneThing's API. Its server calls the SDK APIMatic generates from our spec: a developer uploads a game, connects their own PayPal and gets paid directly. Mirio Games never touches the money."

**8. Close (2:35–2:45)**
- Back to the first shop page, the logo and the URL.
- VO: "One photo, one page, paid with PayPal, and ready for AI agents. OneThing."

**Lines kept for the Devpost text and Q&A (too long for the video)**
- "Card networks are building agentic payments for certified agents spending unattended. OneThing works today with the assistants people already use, no enrollment needed, because the one step that needs trust, approving the payment, happens at PayPal, by the buyer or by an agent the buyer chose to trust."
- "Permissionless: OneThing asks nothing of the agent. No identity, no enrollment, just a readable catalog, an order link and a person clicking pay. Whether an assistant takes part is up to its own maker: on Oct 23 Grok, Kimi K3 and Meta's Muse completed the flow, ChatGPT couldn't open /llms.txt, and Gemini declined to create a payment link by policy."
- The two ways to pay, both tested Oct 23: Grok and Kimi hand the buyer a pay link and the buyer pays at PayPal; Muse placed the order the same way, then paid at PayPal itself, in its own browser, with a PayPal login the buyer had saved in Muse's vault. OneThing didn't change between them. "The order is the same; who clicks pay is the buyer's choice: themselves, or an agent they've trusted with their login." Either way the money is approved on PayPal's page, never inside OneThing. For Q&A: that's delegation by the buyer, not a OneThing feature, and the card networks' agent tokens (Mastercard Agent Pay, Visa's Trusted Agent Protocol) are the scoped, revocable version of the same idea.
- "Agents fail purchases most often not at paying, but at knowing whether it worked. Every OneThing order answers that: status, receipt, and the access code or tracking as data." (from Muse's debrief)
- "Not 'agents can buy here', but 'agents can buy here and prove what happened.'" (Muse)
- Why PayPal: a seller gets paid by typing an email, with no onboarding at all, and the money goes straight to them; OneThing never holds it. The agent design itself works with any payment provider that has hosted checkout.

**Before recording**
- Rename the sandbox partner business account from "Test Store" to OneThing; it shows on the Connect PayPal page.
- Open the Render site a minute ahead, so the first page load isn't slow.
- Have three sandbox accounts ready: the seller (sign in), a business account that has never connected (for Connect PayPal), and the buyer.
- Dry-run step 6 off camera in Grok. Tested Oct 23: Grok, Kimi K3 and Meta's Muse completed the whole loop (Muse also paid, with the vaulted login), and so did our own fetch-only test agent. ChatGPT couldn't read /llms.txt, and Gemini refused by policy to create the payment link, so neither goes on camera or in the caption.
- Step 6 makes a new order each take (every order link opens one), so expect a few unpaid test orders; they cost nothing.
- Pay as a **personal** sandbox buyer. PayPal refuses the seller's account and the platform account ("This PayPal account is associated with the merchant…"), which cost two of Muse's attempts.
- After changing a shop, wait 5 minutes or the assistant may read an old `/llms.txt` (it's cached that long).
- Use a fresh browser profile, logged out of PayPal, so PayPal shows its sign-in pages instead of jumping ahead.

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
