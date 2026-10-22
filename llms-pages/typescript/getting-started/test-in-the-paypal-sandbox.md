# Test in the PayPal sandbox

Source: /#/typescript/x-redirect/cGFnZSUzQWd1aWRlcyUyRnNhbmRib3g

The hosted API at `https://one-thing-ash0.onrender.com` runs entirely on PayPal's sandbox:
payments, payouts to sellers and seller onboarding all use test accounts, and no real money moves.
Real cards and real PayPal logins are refused.


# Get test accounts

1. Sign in to the [PayPal developer dashboard](https://developer.paypal.com/dashboard/accounts).
2. Under **Sandbox → Accounts**, PayPal has already made a **business** account and a
   **personal** account. Open each one to see its email and password.
   - **Business** is the seller: use its email as the shop's `paypal_email`, or connect it.
   - **Personal** is the buyer: log in with it at checkout.
3. To pay by card instead, open **Testing tools → Credit card generator** and use the card it
   makes on the **Pay with Debit or Credit Card** option.


# Get paid as a seller

A shop needs somewhere for the money to go before it can go live. Either:

- **Type an email:** `updateShop` with `paypal_email` set to the sandbox business email.
- **Connect PayPal:** `connectPayPal` returns a PayPal onboarding link. Open it, sign in with a
  sandbox business account and agree; PayPal sends you back to the shop's manage page.
  `getPayPalConnection` then reports `receivable` and `emailConfirmed`.

After a sale, the payment shows up in that sandbox business account at
[sandbox.paypal.com](https://www.sandbox.paypal.com).


# Try every kind of sale

| Try | How |
|---|---|
| Physical product | Pay, then `listOrders` shows the PayPal shipping address; `markOrderShipped` adds tracking |
| Digital file | `uploadDigitalFile` before going live; the thank-you page has the download link |
| Access code | `delivery: access_code` and `access_url`; check the code with `verifyAccessCode` |
| Sizes and colours | Set `options` with `updateShop`; pass the buyer's pick to `createCheckoutOrder` |
| Sold out | Set `stock: 1`, buy it, then try again: checkout answers 409 |
| AI agent | Call `create_order` on the MCP server, open `approve_url`, pay as the buyer, then `get_order` |


# Running OneThing locally

The API runs on `http://localhost:3000` (the **local** environment in the SDKs). One catch:
PayPal won't issue a client token for `localhost`, so the shop page doesn't show the PayPal
button there. Test checkout on the hosted deployment, or locally through the MCP server's
`create_order`, whose `approve_url` opens PayPal's own payment page.



