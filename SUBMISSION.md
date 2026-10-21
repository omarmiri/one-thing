# OneThing: submission pack

PayPal AI Hackathon, "Build what's next with PayPal and AI". Deadline **Thu Nov 12, 2026, 12:00 pm PT**
(Devpost also shows 3:00 pm EST). Judging Dec 1–15, winners around Dec 21. Read on Devpost on Oct 21.

## 1. What's required, and where we stand

| Requirement | Status |
|---|---|
| Meaningful PayPal use | ✅ JS SDK v6, Orders v2 (payee routing, shipping), tracking API, webhooks. A sandbox sale works end to end |
| Meaningful AI use | ✅ Gemini vision and structured output design every shop; chat redesign. ⚠️ Hero art fails on the free Gemini tier |
| Working demo judges can use | ✅ Hosted at one-thing-ash0.onrender.com |
| Text description, tools used | Draft in section 5 |
| Public repo with a visible license | ✅ MIT shows in About. ⚠️ About description is outdated and has no website link |
| Demo video under 3 min, public on YouTube, no unlicensed music | ❌ Not made. Script in section 6 |

## 2. Prizes and the rule that shapes the plan

> "A project can only win up to one (1) Grand Prize and one (1) Sponsor Prize OR one (1) Honorable
> Mention Prize and one (1) Sponsor Prize."

So we aim for **one main-track prize plus one sponsor prize**.

**Main track** (all eligible submissions): 1st $12k, 2nd $8k, 3rd $5k; then $5k each for Most
Creative, Most Impactful, Best Demo Delivery, Best Use of PayPal + AI, Best Use of Agentic Commerce.

| Main-track target | Fit today | What would move it |
|---|---|---|
| **Best Use of PayPal + AI** | Strong. AI builds the whole shop and PayPal takes the money in one flow | Webhooks live, hero art working, a seller copilot or Payouts for more PayPal depth |
| **Most Creative** | Good. Three ways to start, recommendation shops, access codes for games | Showcase components such as the animated flip-book for books |
| **Best Use of Agentic Commerce** | Weak today. Humans buy, no agent does | An agent endpoint per shop so an AI agent can find the product and pay through PayPal |
| Top 3 overall | Plausible if the video is sharp and the gaps below are closed | All of the above |

**Sponsor prize: pick one to push.** Only one can be won.

| Sponsor prize | Winners | Our use today | Verdict |
|---|---|---|---|
| **APIMatic** ($1k + 6 months Business) | 3 | OpenAPI 3.1 spec, TypeScript and Python SDKs, docs portal with working "Try it", PayPal Context Plugin used while building | **Primary.** Three slots, our use is real and visible, and few entries will go this deep |
| **Channel3** ($1.5k) | 1 | Search, store-link lookup, recommendation shops with tracked buy links per shop | Strong backup. Only one winner, so higher risk |
| AG Grid ($5k / $2k / 3 × $1k) | 5 | One orders table | Most money but our use is light; only worth it with a real seller dashboard |
| Render (credits) | 3 | Hosting and Postgres via Blueprint | Low value; mention it, don't chase it |
| Bryntum, Elastic, KERNEL, Postman, Zapier, Astropods | – | Zapier hook, Postman collection | No separate prize for most; mention what we use |

## 3. Scorecard against the judging criteria

| Criterion | Strengths | Gaps |
|---|---|---|
| **Technological implementation** | Orders v2 with payee = seller; v6 SDK with client token; idempotent capture via popup, poll, redirect or webhook; tracking pushed to PayPal; Gemini structured output with a contrast guard; OpenAPI and SDKs | Webhooks not configured on Render; hero art fails (no image quota); no PayPal Payouts or Agent Toolkit yet |
| **Design** (complete product) | Three-start onboarding, one "what we guessed" panel, mobile pages, QR to pay on phone, gallery, manage page with grid | No seller accounts (private manage link only); test shops in the public gallery; AI price guesses can be off ($0.50 for a games site); search ignores "under $60" |
| **Potential impact** | Clear audience: people with one thing to sell. A real seller (Raptor Rush on miriogames.com) uses access codes | Needs two or three real sellers' shops and one line of evidence each ("sold out of X", "set up in 40 s") |
| **Innovation** | AI does the whole shop and the seller only approves; spec-not-HTML keeps checkout safe; recommendation mode; access codes unlock apps and games | Similar to Gumroad, Stan, Shopify Magic at first glance. The flip-book and agent buying are what make it look new |
| **Presentation** | The one-minute claim is true and can be timed on screen | Video not made |

## 4. Plan to Nov 12 (about 3 weeks)

**Must do (week 1)**
1. Configure the PayPal webhook for `https://one-thing-ash0.onrender.com/api/paypal/webhook` and set `PAYPAL_WEBHOOK_ID`, so the webhook log fills during the demo.
2. Hero art: enable billing on the Gemini key, or hide the hero-art state when there's no image quota.
3. Curate the gallery: a "show in gallery" switch, remove test shops, and seed 4–6 good demo shops (Raptor Rush, a book, a handmade physical item, a preset pack, one recommendation).
4. Fix the two AI quality issues seen in testing: price guesses for links and the price limit in product search.
5. GitHub About: description "Sell your one thing in about a minute: AI designs the shop, PayPal takes the payments", website link to the live app, topics (paypal, gemini, ai, nextjs, hackathon).

**Prize movers (week 2), in order**
6. **Showcase components**, starting with the flip-book for books (about half a day): Gemini picks the showcase and fills it. Feeds Most Creative and Design.
7. **Agent-ready shops** (1–2 days): a machine-readable product endpoint and an MCP server per shop (`get_product`, `create_order`), with a short clip of an AI agent buying through PayPal. Feeds Agentic Commerce and Innovation.
8. **APIMatic depth** (half a day): publish the SDKs to GitHub, generate APIMatic's context plugin for OneThing's API, and have Raptor Rush call `verifyAccessCode` through the TypeScript SDK.

**If time allows**
9. Channel3 earnings ledger and PayPal Payouts to recommendation sellers.
10. Seller copilot on the PayPal Agent Toolkit ("what do I need to ship today?").
11. AG Grid seller dashboard across shops.

**Week 3:** record the video, write the Devpost entry, submit by **Nov 11** for a day of buffer.

## 5. Devpost text (draft)

**Name:** OneThing

**Tagline:** Sell your one thing in about a minute. AI designs the shop, PayPal takes the payments.

**Inspiration.** Most people who want to sell one thing (a mug they make, an ebook, a small game)
don't need a store. Today they stitch together a page builder, a PayPal button and copy they write
themselves, or give a cut to a platform whose page looks like everyone else's.

**What it does.** Start from a photo, a link, or a product you'd recommend. Gemini works out what it
is, whether it ships or downloads, what to charge and what to call the link, then designs a
one-product page: layout, palette from the photo, fonts, headline, story, FAQ. You check one panel
of guesses and click Go live. Buyers pay with PayPal or by card, and the money goes straight to your
PayPal account. Physical orders get PayPal's shipping address and tracking pushed back to PayPal.
Digital products deliver a private download or an access code that unlocks your app or game. No
product? Pick one from Channel3's catalog and earn a referral commission.

**How we built it.** Next.js 16 on Render with Postgres. Gemini returns a structured design spec,
never HTML: our templates render it and our code places the PayPal button, so a bad generation can't
break checkout. PayPal JS SDK v6 with a server-made client token, Orders v2 with the seller as payee,
the tracking API and verified webhooks, with capture that's idempotent across the popup, a poll,
the redirect and the webhook. Channel3 search and lookup with per-shop tracked links. The whole API
is in OpenAPI 3.1, and APIMatic generates TypeScript and Python SDKs and the docs portal.

**Challenges.** PayPal's v6 eligibility service refused our sandbox app, and PayPal's window
sometimes never handed the approval back. We traced both and made checkout complete regardless.

**Accomplishments.** Timed on the live site: photo to designed shop in about 20 s, live in one
click, a card payment in about 30 s.

**What's next.** Agent-ready shops that AI shopping agents can buy from through PayPal, a seller
copilot, and PayPal Payouts for recommendation earnings.

**Built with:** PayPal (JS SDK v6, Orders v2, tracking, webhooks), Google Gemini, Channel3, Render,
APIMatic, AG Grid, Zapier, Postman, Next.js, PostgreSQL.

**Try it:** the live app link, plus a sandbox buyer account or "use a test card from PayPal's
credit card generator" in the testing instructions.

## 6. Video script (under 3 minutes)

| Time | Scene |
|---|---|
| 0:00–0:15 | The problem: one product, five tools, an afternoon of setup |
| 0:15–0:55 | Snap a photo of a real product → drafted shop on screen with a visible timer → fix one guess → Go live |
| 0:55–1:25 | Buyer on a phone (scan the QR) pays with PayPal; seller's grid shows the order, Mark shipped pushes tracking to PayPal |
| 1:25–1:50 | A book becomes a flip-book page (once built); a game sells access codes (Raptor Rush unlocks) |
| 1:50–2:15 | No product? Find one on Channel3, recommendation page live, earn per sale |
| 2:15–2:40 | Agent buys from a shop through PayPal (once built), or the API, SDKs and docs portal |
| 2:40–2:55 | Gallery of shops; close on "Sell your one thing in about a minute" |

## 7. Submission checklist

- [ ] Video on YouTube, public, under 3 minutes, no unlicensed music
- [ ] Devpost text, tools section, testing instructions with a sandbox buyer or test-card note
- [ ] Live app reachable; demo shops seeded; test shops hidden
- [ ] Webhook configured; hero art working or hidden
- [ ] README up to date; GitHub About description and website set
- [ ] APIMatic portal republished from the latest spec
- [ ] Submitted by Nov 11
