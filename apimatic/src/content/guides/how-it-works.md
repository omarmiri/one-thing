# How OneThing works

OneThing makes a one-product shop from a single input and takes payments with PayPal.

1. **Start.** Call `createShop` with a photo (`source=photo`), a link (`source=link`) or a
   product picked from `searchProducts` (`source=channel3`).
2. **AI draft.** Gemini works out what the product is, whether it's physical, digital or a
   recommendation, how it's delivered, the price, a short link and the page design. The
   response gives you the shop's `slug` and its admin `token`.
3. **Check and go live.** `getShop` shows the guesses. `updateShop` fixes anything that's off.
   Send `status: live` and the shop is open at `https://<host>/<slug>`.
4. **Get paid.** Buyers check out with PayPal. Physical orders arrive with the buyer's
   address; mark them shipped with `markOrderShipped` and PayPal shows the buyer the tracking.
   Digital orders get a private download link, or an access code (see the next guide).

Seller endpoints need the admin token in the `x-admin-token` header. Checkout, downloads and
access-code checks are public.

## Recommendations

A shop made from a store's product page, or from `searchProducts`, is a **recommendation**:
buyers purchase at the retailer through Channel3's tracked links, and the shop earns the
commission. These shops have `product_type: referral` and no PayPal checkout.
