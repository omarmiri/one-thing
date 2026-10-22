# How OneThing works

Source: /#/typescript/x-redirect/cGFnZSUzQWd1aWRlcyUyRmhvdy1pdC13b3Jrcw

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


# Accounts

`signIn` takes an email address or a phone number: the first time creates the account, after that
it signs back in. Call `createShop` with the session cookie it sets and the shop belongs to that
account, so sellers find all their shops at `/account` without keeping each shop's private link.
On the website, sellers can also use **Log in with PayPal**, which records the PayPal account their
sales are paid into and fills it in on their shops.


# Photos

A shop starts from one photo. `addPhotos` adds more (up to 8 in all) and `setPhotoOrder`
reorders or removes them; the first is the cover. With several photos, the shop page shows a
swipeable gallery, and buyers can open any photo full screen and page through the rest.


# Getting paid

`connectPayPal` sends the seller through PayPal's onboarding, after which sales go straight to
their PayPal account; `getPayPalConnection` checks where that stands. A shop can also go live with
just a `paypal_email`.


# Sizes, colours and the questions buyers will ask

While drafting, Gemini also suggests what buyers will want to choose (sizes, colours with swatches)
and what they'll ask that the listing doesn't say, such as dimensions. They're saved as the shop's
`suggestions` and applied only when the seller confirms: `updateShop` with `options` (and stock per
combination in `option_stock`), and `facts` for the answers, which become product details.
`checkMissingDetails` asks again after an edit.

For colours, `matchColorPhotos` works out which photo shows each one and `setColorPhotos` saves
it, so the shop page switches photo when a buyer picks a colour. Checkout then takes the buyer's
pick as `options`, and the order records it.


# Recommendations

A shop made from a store's product page, or from `searchProducts`, is a **recommendation**:
buyers purchase at the retailer through Channel3's tracked links, and the shop earns the
commission. These shops have `product_type: referral` and no PayPal checkout.



