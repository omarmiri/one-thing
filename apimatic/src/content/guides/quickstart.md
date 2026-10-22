# Quickstart: a live shop in five calls

This walks through the whole loop against the hosted sandbox deployment: create a shop with AI,
publish it, sell one unit through PayPal's sandbox, and ship it. Use `curl` as below, the **Try
It!** button on each endpoint page, or the SDKs (see **SDK Quickstart**).

**Base URL:** `https://one-thing-ash0.onrender.com`. All payments are PayPal sandbox; no real
money moves. You need a PayPal sandbox **business** account email (the seller) and a
**personal** account (the buyer), from the
[PayPal developer dashboard](https://developer.paypal.com/dashboard/accounts). See
**Test in the PayPal sandbox** if you don't have them yet.

## 1. Create the shop

`createShop` takes a photo, a description or a link. A description alone is enough to start:

```bash
curl -X POST https://one-thing-ash0.onrender.com/api/shops \
  -F source=photo \
  -F "description=Hand-thrown stoneware mug, 12 oz, glazed in ocean blue. Dishwasher safe." \
  -F type=physical \
  -F price=34 \
  -F shipping=6 \
  -F stock=8 \
  -F ship_countries=US,CA \
  -F paypal_email=<your sandbox business email>
```

Add `-F photo=@mug.jpg` to send a photo; Gemini then reads the product from the picture too.
Gemini takes 15–40 seconds to design the page. The reply:

```json
{
  "slug": "oceanmug",
  "token": "Xq3vT9kLm2…",
  "manageUrl": "/manage/oceanmug?token=Xq3vT9kLm2…"
}
```

Keep `token`: it's the shop's **admin token**, it's shown only once, and every seller call needs
it in the `x-admin-token` header. `manageUrl` opens the same shop in the seller's web editor.

## 2. Check what the AI guessed

```bash
curl https://one-thing-ash0.onrender.com/api/shops/oceanmug \
  -H "x-admin-token: $TOKEN"
```

`spec` is the page design (headline, palette, layout, FAQ). `suggestions` lists sizes or colours
buyers may want to pick and questions they'll ask that the listing doesn't answer. To change the
design in words, call `refineShopDesign` with an instruction such as "make it feel more premium".

## 3. Go live

```bash
curl -X PATCH https://one-thing-ash0.onrender.com/api/shops/oceanmug \
  -H "x-admin-token: $TOKEN" \
  -H "content-type: application/json" \
  -d '{ "status": "live" }'
```

The shop is now open at `https://one-thing-ash0.onrender.com/oceanmug`. The same call changes
any setting you send (price, stock, link name), and the rest stay as they are.

## 4. Make a sale

Open the shop link in a browser and pay with the sandbox **personal** account, or choose
**Pay with Debit or Credit Card** and use a card from the sandbox credit card generator. You land
on the thank-you page.

Building your own checkout instead of using the shop page? Call `createCheckoutOrder` with the
`slug`, pass the PayPal order `id` it returns to the PayPal JavaScript SDK, and call
`captureCheckoutOrder` once the buyer approves.

## 5. Ship it

```bash
curl https://one-thing-ash0.onrender.com/api/shops/oceanmug/orders \
  -H "x-admin-token: $TOKEN"
```

The paid order shows `fulfillment_status: to_ship` and the address PayPal collected. Mark it
shipped with its `id`:

```bash
curl -X POST https://one-thing-ash0.onrender.com/api/shops/oceanmug/orders/$ORDER_ID/ship \
  -H "x-admin-token: $TOKEN" \
  -H "content-type: application/json" \
  -d '{ "carrier": "USPS", "trackingNumber": "9400111899223817502345" }'
```

The tracking number is pushed to PayPal, so the buyer sees it in their PayPal activity.

## Next

- Sell an app or game instead of a physical item: **Sell an app or game with access codes**.
- Let AI shopping agents buy from the shop: **Let AI agents buy**.
- Get every paid and shipped order in Zapier: set `zapier_hook_url` (see **Webhooks**).
