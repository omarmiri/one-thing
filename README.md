# OneThing

**Sell your one thing in about a minute.** Start from a photo, a link, or a product you'd
recommend. Gemini works out what it is, how it's delivered, what to charge, and designs a
one-product landing page. PayPal takes the payments, which go straight to the seller's PayPal
account.

Built for the [PayPal AI Hackathon](https://paypalaihackathon.devpost.com/).

**Timed on the live deployment (PayPal sandbox):** a photo becomes a designed shop in about 20
seconds, goes live in one click, and a buyer paying by card completes checkout in about 30 seconds.

| | |
|---|---|
| **Live app** | [one-thing-ash0.onrender.com](https://one-thing-ash0.onrender.com) (PayPal sandbox) |
| **Make a shop** | [one-thing-ash0.onrender.com/new](https://one-thing-ash0.onrender.com/new) |
| **Your shops** | [one-thing-ash0.onrender.com/account](https://one-thing-ash0.onrender.com/account): sign in with an email, a phone number or PayPal |
| **Gallery** | [one-thing-ash0.onrender.com/gallery](https://one-thing-ash0.onrender.com/gallery): every live shop, each in its own AI-chosen colours |
| **Example shop** | [one-thing-ash0.onrender.com/raptorrush](https://one-thing-ash0.onrender.com/raptorrush): Raptor Rush, a browser game sold with access codes |
| **API docs and SDKs** | [omarmiri.github.io/one-thing](https://omarmiri.github.io/one-thing/), generated with APIMatic, with working "Try it" calls |
| **OpenAPI spec** | [one-thing-ash0.onrender.com/openapi.yaml](https://one-thing-ash0.onrender.com/openapi.yaml) |
| **MCP server for AI agents** | `https://one-thing-ash0.onrender.com/api/mcp` (Streamable HTTP): find a shop, read the product, order it through PayPal |

## Tested end to end

Timed on the hosted app, from clicking **Build my shop** to a drafted page:

| Start | Input | Draft ready | What the AI got |
|---|---|---|---|
| Upload a photo | a lavender stoneware mug | ~20 s | "Stoneware Ombre Mug", physical, $24 + $5 shipping, US, `/purplemug`, copy, details and FAQ |
| Paste a link | `https://miriogames.com` | ~20 s | a digital product unlocked by access code, pointing back at the games site |
| Find a product | "gifts for trail runners" | search 5 s, build ~18 s | a Scarpa tee recommendation page at $40, earning up to 5%, with a tracked buy link |

**Go live** takes a second. A sandbox buyer then paid $29.00 by guest card on `/purplemug`. The
order was captured, PayPal's shipping address was saved, and it landed in the seller's grid as
"to ship".

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
  OneThing never holds funds. Sellers connect that account through PayPal's own onboarding, and
  PayPal, not us, says when it's ready to be paid.
- **Agents shop, people pay.** Every shop is agent-ready: an AI agent can find it, read it and place
  an order, but the buyer approves every payment at PayPal, so no agent spends money on its own.
- **Motion that explains, not decorates.** In the spirit of Famo.us, every element on a shop page
  is a body on a spring, so the page responds to the buyer like a physical thing. It's kept quiet:
  sections settle into place once, the product stays in view while its features arrive, and photos
  open full screen from where they sit. Nothing loops or bounces, it switches off for anyone who
  asks for reduced motion, and the content is plain HTML underneath.
- **No product? Recommend one.** Through Channel3, a creator can turn a product they love into a
  recommendation page and earn a referral commission, with a clear disclosure on the page.

## Features

### Sellers

- **An account in one field.** Sign in with an email or a phone number (no password), or with
  **Log in with PayPal**, which also sets the PayPal account sales are paid into. **Your shops**
  (`/account`) lists every shop with its manage page.
- **Three ways to start** at `/new`:
  - **Upload a photo** of your own product, with a sentence or two if you like. If the network
    drops the upload (corporate DLP and proxies often block file uploads), the browser shrinks the
    photo to a JPEG and sends it again as base64 in a JSON body (`POST /api/shops` and
    `POST /api/shops/:slug/photos` take either; see `src/lib/formBody.ts`). If that fails too, the
    seller gets a clear error instead of an endless spinner. The Photos panel does the same.
  - **Paste a link.** A store product found by Channel3 becomes a recommendation; any other page
    is read (public addresses only, size- and time-capped) and its preview image becomes the photo.
  - **Find a product** with Channel3 search across 100M+ products, shown as "earn up to X%" cards.
- **AI guesses everything** in one pass: product name, physical or digital, price, a short link
  name, and the page design (one of 4 layouts, a palette taken from the photo, a curated font
  pair, headline, story, bullets, details and FAQ). A palette colour Gemini gets slightly wrong
  (`#fff`, no `#`, `rgb()`) is repaired, and one it gets badly wrong is replaced with a default,
  so a single bad colour never fails the whole design.
- **Buyer options, suggested by the AI.** While drafting, Gemini works out whether the product
  comes in variants and proposes them: sizes in the usual range, colours with swatches sampled from
  the photo. Options the seller named start ticked; the AI's own guesses start unticked. One-of-a-kind
  items (vintage, handmade one-offs) get no options. The seller edits values and swatch colours, and
  sets **stock per combination** (blank means unlimited).
- **A photo for each colour.** Add a photo of each variant and Gemini matches photos to colours,
  including when only a print or detail changes colour (a red, gold, green or blue dragon on the same
  white shirt). It runs when photos are added or from **Match photos to colours**, and the seller can
  change any match from the swatch's thumbnail. Photo matches save at once (with **Undo**), unlike the
  rest of the panel, which waits for **Save**.
- **"Buyers will ask."** Gemini also lists up to three facts buyers, or shopping agents, need that
  the listing doesn't state (the size of this pair, a print's dimensions, a game's platform). The
  seller's answers become product details. **Check for missing details** runs it again on any shop.
- **More photos while refining.** A shop starts from one snapshot; the manage page's Photos panel
  adds up to 8 (camera or library), reorders them and picks the cover. Uploads are turned upright,
  resized and stored as WebP.
- **A playable teaser for games.** Paste a game's page and OneThing measures its sprite sheets
  (or reads the grid the page declares), Gemini picks the hero, enemies and backdrop and writes the
  copy, and the shop page gets a short canvas game in the game's own art.
- **Hero art** made in the background by a Gemini image model. If the configured model isn't on
  the key, OneThing finds one that is, and records why if none works.
- **Chat to redesign** ("make it warmer", "shorter copy") with a live preview.
- **Short links the seller picks**, like `/raptorrush`, with a live availability check. Renamed
  shops keep their old links working (308 redirects).
- **Connect PayPal.** On the manage page, one button takes the seller through PayPal's onboarding
  (Partner Referrals): existing PayPal users sign in, new ones sign up, and personal accounts are
  upgraded to business inside PayPal's flow. Back on the manage page, a checklist shows what PayPal
  reports (connected, email confirmed, can receive payments), with **Check again** and
  **Disconnect**. **Go live** waits until PayPal says the account can be paid, or a PayPal email is
  entered as a fallback. A connected account carries over to the seller's other and new shops.
- **A manage page** (open from Your shops, or by its private link): settings, publish, photos, and an
  [AG Grid](https://www.ag-grid.com/) orders table with sort, filter, search, **Mark shipped** and
  **Refund**. Refund sends the full amount back through PayPal's refund API. When a seller
  connected PayPal, the Platform app refunds on their behalf, since Connect asks for the `REFUND`
  permission. When a sale was paid straight to OneThing's own account, OneThing refunds it
  directly. When it was paid to an email the seller only typed in, PayPal lets only that account
  refund, so the seller refunds it in PayPal and marks it refunded here. A
  `PAYMENT.CAPTURE.REFUNDED` webhook marks it too. A refunded order's download link and access
  code stop working, an unshipped item goes back into stock, and the receipt, `get_order` and
  Zapier (`order.refunded`) all say so.
  A **Via** column shows whether each order came from the shop page or an AI agent, and which
  agent ("AI agent · Grok"), credited the same way as the stats below (`orders.agent`).
- **Design A/B test** on the manage page, for signed-in sellers on shops in their account: an
  "A/B test" panel under the design chat shows which model wrote the current design, makes a
  version B with Gemini or Qwen from the seller's same words and photo (the pasted link's page
  text isn't kept, so B doesn't see it), and **Show version B** swaps the two, on the preview and
  the live page. Swap again to go back. The hero art stays as it was. Signed out, there's no
  panel and `POST /api/shops/[slug]/ab` answers 403.
- **Visitors and sales** on the manage page (7, 30 or 90 days): visitors → checkouts started →
  paid, conversion and revenue, side by side for people on the shop page and AI agents, with
  visitors per day, where people came from and which agents read the shop, with each agent's
  visits and paid orders ("3 visits · 1 paid"). No cookies: a visitor
  is a hash of IP, browser and the day ([src/lib/stats.ts](src/lib/stats.ts)), so nobody is
  followed past a day. People are counted by a beacon the page sends once loaded, so crawlers
  that don't run JavaScript don't count, and the seller's own preview never does. An agent visit is
  a read of the product JSON, an MCP `get_product`/`create_order`, the `llms.txt` order link, or
  an assistant fetching the page for a user (ChatGPT-User, Claude-User, Perplexity-User…).
  Which agent it was comes from a known user agent first, then the name the agent gave itself:
  the MCP client's `clientInfo.name` (carried in the `Mcp-Session-Id` we hand out at
  `initialize`, since the server is otherwise stateless) or `?agent=<name>` on the GET endpoints.
  Failing both, the user agent's first word; browser-like ones show as "Unidentified (browser-like)".
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

- **A page that moves like an object**, on springs: sections rise into place as they scroll in,
  and the product photo has a little depth and turns toward the pointer.
- **A feature story:** the product stays pinned while the story and each feature arrive in turn,
  each bringing the next photo and a closer look. White studio shots melt into the card colour.
- **A swipeable gallery** when there are several photos: it follows the finger, a flick carries it
  one photo on, and it resists past the ends.
- **Inspect:** tap a photo and it grows from its place to fill the screen. Swipe through the
  photos, double-tap to zoom, and swipe down or press Esc to put it back where it was.
- **Size and colour pickers** in the shop's own palette when the product has options. Picking a
  colour slides the photo gallery to that colour's photo. Sold-out
  combinations stay visible but can't be picked, low stock shows ("Only 1 left in Black / M"), and
  the choice appears in PayPal's review page, the receipt and the seller's grid.
- **A sticky buy bar** with the PayPal button, once the top one has scrolled away.
- **PayPal checkout** with the JS SDK v6 buttons. The price always comes from the database, never
  the browser.
- **Pay with a PayPal account or as a guest by card.** While PayPal's window is open, the page
  also watches for the approval itself, so checkout completes even if PayPal's window never hands
  back.
- **Pay on your phone:** desktop shop pages show a QR code, and payments that come back by
  redirect (as on mobile) are captured on the thank-you page.
- **Thank-you page** with the download button, the access code and its **Start now** link, or the
  shipping confirmation.

### Everyone

- **Gallery** at `/gallery`: every live shop, newest first, each card in that shop's own palette, in a dense marketplace-style grid (2 columns on phones up to 6 on wide screens). The
  home page shows the newest 40 as a compact "Made with OneThing" carousel of photos, paged with arrows. Ticking "Show in the OneThing gallery" only *asks*: a shop
  appears in the gallery, on the home page and in agent search once it's approved at
  `/admin/gallery`, a review page that isn't linked anywhere. Sign in there with the Opal Games
  usage dashboard account (the same Supabase sign-in, and only emails in its `analytics_allowlist`),
  so the key never goes in a URL; `/admin/gallery?key=<ADMIN_KEY>` still works too. Changing an approved shop's photos, product name or headline sends it back
  to review. Shops already in the gallery when review was added stayed approved. Each shop there
  shows how to reach its seller: the account's email or phone, the seller email typed at setup,
  and the PayPal email. A **Find any shop** box (`?q=`) looks up any shop by name, link or
  description, including ones never sent to the gallery, with the same contacts. A shop that
  belongs to no account (made signed out, or before accounts existed) has **Give to account**.
  Enter the seller's email or phone, and the shop shows up in their **Your shops**, for when the
  private manage link is lost. Shops that already have an owner are never moved.
- **Site stats** at `/admin/stats?key=<ADMIN_KEY>` (not linked anywhere): the same funnel for the
  whole site, people vs agents, plus a table of every shop with visits or orders.

### AI agents

Every live shop is agent-ready:

- **An MCP server** at `/api/mcp` (Streamable HTTP, stateless JSON, no auth) with four tools:
  `search_shops` (gallery shops by keyword, each with its cover `image`), `get_product` (with options and stock per
  combination), `create_order` (takes the buyer's pick, e.g. `{"Size": "M"}`, and returns a
  `pay_url` for the buyer) and `get_order` (captures the payment once the buyer has approved, then
  returns what they bought in `delivery`: access code, download link, or shipping address and
  tracking). Add it to an MCP client, e.g. Claude Code:
  `claude mcp add --transport http onething https://one-thing-ash0.onrender.com/api/mcp`.
  Working in this repo, you don't need to: [.mcp.json](.mcp.json) registers it, so a new Claude
  Code session here has the tools (Claude Code asks once to approve the server).
  **In ChatGPT**, add it as a custom MCP server: chatgpt.com/plugins, then **+**, then "Add custom
  MCP server", with that URL and no authentication. Pick it with **@** in a chat. Every tool says
  explicitly whether it is read-only, destructive, idempotent or open-world (ChatGPT uses this to
  decide when to ask the user first). `create_order` is the only one that isn't read-only, and it
  charges nothing.
- **A product card** ([src/lib/widget.ts](src/lib/widget.ts)) for hosts that draw tool results as UI
  (ChatGPT and other MCP Apps hosts). It's an MCP Apps resource, `ui://onething/shop-card-v1.html`, linked from
  `search_shops`, `get_product` and `create_order`. It shows a grid of shops, then the product with its
  photo, option chips and **Buy with PayPal**. That button calls `create_order` from the card itself
  and turns into **Pay $96.00 with PayPal**, which opens the `/o/` pay link in the buyer's
  browser. The card speaks both ChatGPT's `window.openai` API and the standard MCP Apps postMessage
  bridge. Tested in ChatGPT. Clients that draw the card get different words from the server. A
  client counts as one when it announces MCP Apps support (`io.modelcontextprotocol/ui`) or is
  ChatGPT. Their instructions and `show_buyer` say the card already shows the real photos, so the
  model should reply in a sentence and add no images. Told to show the photo it couldn't display,
  ChatGPT made up product pictures of its own.
- **A suggested reply in every answer** (`show_buyer`, in search results, the product JSON, order
  and status replies and the MCP tools): short Markdown with the links already written as links.
  The product's cover photo as a Markdown image (one per shop in search results), the product, its
  options and "Which size?"; then the photo again with "**[Pay $96.00 with PayPal](…)**"; then
  what the buyer got and "[Your receipt](…)". Agents are told to show it exactly as written, photo
  included: left to phrase things themselves they were wordy and often printed bare URLs, and
  when it was only a recommendation, Muse and Kimi dropped the photo. Whether the photo shows is
  still up to the chat: many block images from other sites and leave the line out. Every
  reply also says back `agent_name`, who the request was credited to in the seller's stats, and
  links we return carry a `?agent=` name on.
- **A pay link** at `/o/<order_id>`: the `pay_url` agents hand the buyer. It redirects to
  PayPal's payment page (or the receipt once paid). PayPal's own approval URL carries a checkout
  token that agent platforms hide from chat as a secret, so agents couldn't show it; this link they
  can. A failed payment comes back from `get_order` as `declined`, `sold_out`, `expired` or
  `failed`, with a `next_step` the agent can follow.
- **`/llms.txt`**: the one URL to give an AI that can only read web pages (free-tier ChatGPT,
  Gemini and the like): "Read https://one-thing-ash0.onrender.com/llms.txt and help me buy
  something from the gallery." It lists the gallery's shops with their cover photo URLs and order links and explains
  how to buy in three steps. Every page links to it (`<link rel="alternate">`), and the home page and gallery show a
  visible link, since browse tools often drop the page `<head>`.
- **Plain GETs** for agents that can only fetch URLs, not call MCP tools:
  `/api/agent/shops?q=<keywords>` (the gallery, like `search_shops`) and
  `/api/agent/shops/<slug>/order?Size=9` (places an order like `create_order`, and returns its
  `pay_url` and `status_url`) and `/api/agent/orders/<order_id>` (status and delivery, like
  `get_order`). The product JSON and `/llms.txt` write the order links out in full, one per size
  or colour, because some assistants only open URLs they've been shown. Each request makes a new,
  unpaid order; the buyer still pays at PayPal. A GET can start an order but never move money.
  Assistants sometimes hand these links to the buyer instead of opening them. A person clicking
  one (the browser sends `Sec-Fetch-User: ?1`, which fetchers don't) gets a page, not JSON: an
  order link makes the order and goes straight to its pay page, an order link missing a size or
  colour goes to the shop page, and the product JSON goes to the shop page (`?view=json` keeps it).
  Search crawlers and link previewers (Slack, Discord, Facebook and the like) get a 403 from
  order links instead of an order, and `/robots.txt` keeps them off order and pay links by name.
  There's no `*` rule, because assistants fetching for a buyer (Claude-User, for one) honour
  robots.txt too.
- **Rate limits** per IP address on everything that costs something: 30 checkouts per 10 minutes
  (web, GET order links and MCP `create_order` together), 10 new shops an hour without an API key,
  and 60 seller AI requests an hour. Going over gets a 429 with `Retry-After` (an error result over
  MCP). The caps are high because assistants shop for many people from a few shared addresses.
  They're there to stop loops and floods, not people. Counts live in Postgres (`rate_hits`), keyed
  by a salted hash of the IP.
- **Product JSON** at `/api/agent/shops/<slug>`: price, shipping, delivery, availability, images
  and FAQ, plus where the MCP server is. Shop pages link to it (`<link rel="alternate">`).
- **schema.org `Product` JSON-LD** on every live shop page, which shopping agents and search
  engines already read.

**Test Panel** ([src/components/TestPanel.tsx](src/components/TestPanel.tsx)): a small "Test Panel" tab on the
edge of the home page, the gallery and every shop, so the page design stays as it is. « slides it open; the grip
drags it along an edge or to any other edge, and the browser remembers where. It opens Grok, Kimi and Perplexity with
a buying prompt for that shop already typed (Perplexity sends it, the other two ask first), copies the prompt and
opens Muse (Meta AI), and walks through adding the MCP connector to ChatGPT. It also explains paying in the PayPal
sandbox and links the agent endpoints. The prompt points the assistant at `/llms.txt` first, since assistants
given only a page link often give up. Perplexity's free plan stopped opening links on 2026-10-28 (it answers
from search results instead), so it comes after Grok and Kimi.

**Tested with a third-party agent.** Meta's Muse, given only the gallery URL, browsed the shops,
ranked its picks, and bought Raptor Rush through the normal shop page and PayPal sandbox checkout
(using a sandbox PayPal login the user saved in Muse). The access code it brought back verified as
valid. The image below recreates that session ([source](docs/muse-checkout-demo.html)):

<img src="docs/images/muse-checkout-demo.png" alt="Muse finds OneThing shops, the user picks Raptor Rush, Muse pays with PayPal sandbox and returns the access code" width="420">

### Developers

- **A documented REST API** for everything the app does: [OpenAPI 3.1 spec](apimatic/src/spec/openapi.yaml),
  served live at `/openapi.yaml`. Every endpoint has a sample request and reply, which the docs
  portal shows as code in each SDK language.
- **SDKs and a docs portal** generated with APIMatic (TypeScript and Python), published at
  [omarmiri.github.io/one-thing](https://omarmiri.github.io/one-thing/). See
  [apimatic/README.md](apimatic/README.md). It includes the agent endpoints (product JSON and the
  MCP server, with a "Let AI agents buy" guide), buyer options and Connect PayPal.
- **Postman collection:** [postman/one-thing.postman_collection.json](postman/one-thing.postman_collection.json),
  with Seller, Buyer and Agents (MCP) folders.
- **Platform API keys** for marketplaces that make shops for their own sellers:
  `Authorization: Bearer ot_sk_…`, made and revoked on `/account/keys` after Log in with PayPal (a typed
  email isn't enough), stored only as a SHA-256 hash. A key reaches its account's shops only;
  `GET /api/platform/shops` lists them, and `connectPayPal` takes a `returnUrl` on an origin
  registered with the key. Shops made with a key inherit nothing (email, PayPal) from the account.
- **Implementation example:** the [Mirio Games indie game market](https://www.miriogames.com/market/).
  Developers upload an HTML game, connect their own PayPal and sell it; buyers unlock it with their
  access code. It runs on the platform API through the APIMatic-generated TypeScript SDK, from a
  separate codebase.
- **Access-code check for your own app:** `POST /api/access/verify` with `{ shop, code }` answers
  `{ valid }`, from any origin. Raptor Rush on miriogames.com uses it to unlock the game.

## Try a sale (sandbox)

1. In the [PayPal developer dashboard](https://developer.paypal.com/dashboard/accounts), under
   Sandbox → Accounts, note a **business** account email (the seller) and a **personal** account
   (the buyer).
2. Create a shop at [/new](https://one-thing-ash0.onrender.com/new): sign in with an email or phone
   number first, then enter the business email as "Your PayPal email" on the manage page. (Or
   **Log in with PayPal** with the business account, which fills it in.) Go live.
3. Open the shop link and pay with the personal sandbox account, or choose **Pay with Debit or
   Credit Card** and use a test card from the dashboard's **Testing tools → Credit card
   generator** (real cards are refused in sandbox). You land on the thank-you page, and the order
   appears in the seller's grid.
4. For a physical order, click **Mark shipped** and add a tracking number.
5. Click **Refund** on the order. The receipt now says it was refunded, and the buyer's sandbox
   PayPal account shows the money back.

To try **Connect PayPal** instead of typing an email: on a draft shop's manage page, click
**Connect PayPal** and sign in with a sandbox business account (not the Platform app's own
account). You come back to a checklist; Go live once it's all ticked.

To try **an agent purchase**: add the MCP server to an agent (see [AI agents](#ai-agents)), ask it
to find and buy something, open the `pay_url` it gives you and pay with the sandbox buyer. That
must be an account that isn't receiving the money: not the shop's PayPal, and not the platform
account either (shops without their own PayPal pay into it), or PayPal refuses the sign-in.
The agent's `get_order` then reports it paid, and the seller's grid shows it **Via AI agent**.

## How it works

```
Seller ── /account ── email or phone, or Log in with PayPal ──► session cookie
       ── /new ──► POST /api/shops ──► Gemini (vision + structured output) ──► design spec (JSON)
          (photo │ link │ Channel3 pick)  └► after(): Gemini image model ──► hero art
          /manage/[slug] ── chat "make it warmer" ──► POST /refine ──► Gemini edits the spec
Buyer  ── /<slug> ── GET /api/paypal/client-token → <paypal-button> (JS SDK v6), or a QR code to pay on a phone
          ├► POST /api/orders                    → PayPal Orders v2 create (price from DB, payee = seller)
          └► POST /api/orders/:id/capture        → capture → mark paid → stock / download / access code / Zapier
PayPal ──► POST /api/paypal/webhook               → signature verified → same idempotent mark-paid → webhook log
Seller's app ──► POST /api/access/verify          → is this buyer's code valid for my shop?
Seller ── Connect PayPal ── POST /api/shops/:slug/paypal → Partner Referrals → PayPal onboarding
          └► GET /api/shops/:slug/paypal/return → ask PayPal (by tracking_id) → merchant id + status
AI agent ──► POST /api/mcp (JSON-RPC) → create_order → buyer opens /o/:id → PayPal → get_order captures + delivers
```

- **Design spec:** [src/lib/design.ts](src/lib/design.ts) defines it; [src/lib/gemini.ts](src/lib/gemini.ts)
  asks for it (from Qwen via [src/lib/qwen.ts](src/lib/qwen.ts) when `DESIGN_PROVIDER=qwen`); [src/components/shop/ShopPage.tsx](src/components/shop/ShopPage.tsx) renders it.
- **Checkout** ([src/components/shop/BuyButton.tsx](src/components/shop/BuyButton.tsx)): the SDK starts
  with a server-made client token. While PayPal's window is open the page polls the capture
  endpoint, which answers 409 until the buyer approves, so a stalled hand-back still completes.
- **Stock is taken before the money is** (`captureWithStock` in [src/lib/orders.ts](src/lib/orders.ts)).
  Every capture path (the popup, the page's poll, the thank-you page, the agent's `get_order`) first
  claims a unit in one atomic `UPDATE … WHERE stock > 0`, for the shop or for the option combination.
  When two buyers race for the last one, only the winner is captured. The other sees "just sold out"
  and PayPal never takes their money; a declined or failed capture gives the unit back.
- **Mark-paid is idempotent** ([src/lib/orders.ts](src/lib/orders.ts)). The capture call and the
  webhook can arrive in either order, and stock, download links, access codes and Zapier still fire
  exactly once. Capture request ids are unique per attempt, so a retry after a decline isn't replayed.
- **Motion layer** ([src/components/motion/](src/components/motion/)): CSS lays the page out and
  springs move each `data-surface` element to and from its resting place. The feature story,
  Inspect and the sticky bar share one spring model; `?motion=0` shows the plain page, and
  `/lab/<shop>` compares it with the calm and crisp feels.
- **Accounts** ([src/lib/accounts.ts](src/lib/accounts.ts)): an email or phone number, or a PayPal
  identity, and a session cookie. Shops made while signed in belong to the account; older shops
  join it when their seller email matches or their private link is opened while signed in.
- **Connect PayPal** ([src/lib/paypal.ts](src/lib/paypal.ts), `connectUrl` and friends): runs on a
  separate **Platform** app's keys, because PayPal refuses Partner Referrals to a Merchant app
  (403 NOT_AUTHORIZED). Checkout and Log in with PayPal stay on the main app. The return URL's query
  string is never trusted: we look the seller up at PayPal by the shop id we sent as `tracking_id`.
  The private manage link rides back in a one-hour cookie, not through PayPal. The payee is the
  connected account once it's ready, else the typed email.
- **Agents** ([src/lib/agent.ts](src/lib/agent.ts), [src/app/api/mcp/route.ts](src/app/api/mcp/route.ts)):
  the MCP server is hand-written JSON-RPC (no SDK), so it runs in a plain Next.js route. Orders it
  starts are stored with `channel = 'agent'`. It shares `startCheckout` and `captureIfApproved`
  ([src/lib/orders.ts](src/lib/orders.ts)) with the shop page and the thank-you page.
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
| `DASHSCOPE_API_KEY`, `DESIGN_PROVIDER=qwen` | [Alibaba Cloud Model Studio](https://modelstudio.console.alibabacloud.com/) → API keys | Optional: **Qwen** (`qwen3.7-plus`, override with `QWEN_MODEL`). With the key alone, Qwen is available in the design A/B test. Add `DESIGN_PROVIDER=qwen` and it writes every shop design and chat edit instead of Gemini, with Gemini as its backup. Everything else stays on Gemini. `QWEN_BASE_URL` defaults to the Singapore endpoint. `npm run compare:designers` runs both on the same shops (stop `npm run dev` first) and writes a side-by-side `compare-designers.html` |
| `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET` | [PayPal developer dashboard](https://developer.paypal.com/dashboard/applications/sandbox) → Sandbox app | Checkout |
| `PAYPAL_LOGIN=on` | Same app → **Log In with PayPal**: Return URL `<APP_URL>/api/account/paypal/callback`, request email, verification status and payer ID | **Log in with PayPal** (off until set, so the button never leads to a misconfigured app) |
| `PAYPAL_PARTNER_CLIENT_ID`, `PAYPAL_PARTNER_CLIENT_SECRET`, `PAYPAL_PARTNER_MERCHANT_ID` | A second sandbox app of type **Platform** (Partner Referrals needs one), and the merchant ID of its sandbox business account | **Connect PayPal**: sellers onboard their own PayPal account; the manage page shows PayPal's checklist and Go live waits for it (a typed PayPal email still works as a fallback) |
| `PAYPAL_WEBHOOK_ID` | Same app → Webhooks → `<APP_URL>/api/paypal/webhook`, event `PAYMENT.CAPTURE.COMPLETED` | Confirms payments if the buyer closes the tab mid-checkout (needs a public URL) |
| `CHANNEL3_API_KEY` | [Channel3 developers](https://trychannel3.com/developers) | "Find a product", store-link lookup and recommendation shops |
| `ADMIN_KEY` | Any long random string (Render generates one) | **Gallery review** at `/admin/gallery?key=<ADMIN_KEY>`; without it no shop can be approved into the gallery. Also unlocks site stats at `/admin/stats?key=<ADMIN_KEY>`. It salts the visitor hashes too, so changing it splits that day's visitors in two. It signs the gallery review sign-in cookie, so changing it signs that out too |
| `ADMIN_SUPABASE_URL`, `ADMIN_SUPABASE_ANON_KEY` | The Opal Games Supabase project's URL and public anon key (the ones `market/market.js` ships) | **Sign-in for gallery review** with the usage dashboard account, allowlisted by `analytics_allowlist`; the password goes only to Supabase. Unset = key link only |

## Deploy to Render

`render.yaml` is a Blueprint: in Render, choose **New → Blueprint** and pick this repo. It creates
the web service and a Postgres database, then asks for the secret env vars. Set `APP_URL` to the
service URL.

## Tools used

| Tool | How it's used |
|---|---|
| **PayPal** JS SDK v6, Orders v2 (create/capture, payee routing, shipping preference), Payments v2 refunds (as the seller via PayPal-Auth-Assertion for connected accounts), order tracking API, webhooks, Log in with PayPal (OpenID Connect), Partner Referrals and merchant integration status | All checkout and payment handling, seller sign-in, seller onboarding with a readiness check, and agent orders the buyer approves at PayPal |
| **Model Context Protocol** | `/api/mcp`, so AI agents can find shops and order through PayPal |
| **Google Gemini** (`@google/genai`) | Reads the photo or page; guesses the product, delivery, price and link; generates the structured design spec and copy; edits it from chat; an image model makes the hero art |
| **Channel3** | Product search, store-link lookup, and recommendation shops that earn through Channel3's tracked buy links |
| **Render** | Hosting and Postgres via `render.yaml` |
| **AG Grid** | The seller's orders table (sort, filter, search, mark shipped, refund) |
| **Zapier** | Optional per-shop Catch Hook: every paid or shipped order is posted to it |
| **APIMatic** | Generates the TypeScript and Python SDKs and the [docs portal](https://omarmiri.github.io/one-thing/) from the OpenAPI spec. Its PayPal Context Plugin gave Claude Code PayPal's API reference while building the PayPal features |
| **Postman** | A collection covering the whole API |
| Next.js 16, PostgreSQL / PGlite, Tailwind, zod | App framework and data |

## License

MIT. See [LICENSE](LICENSE).
