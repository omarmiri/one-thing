# Authentication

OneThing has two kinds of caller: the **seller**, who manages a shop, and everyone else
(buyers, the seller's own app, AI agents), who only use public endpoints.

## Seller calls: the admin token

`createShop` returns an admin token (32 random characters) once. Send it in a header on every
seller call:

```http
x-admin-token: Xq3vT9kLm2…
```

The token belongs to one shop and never expires. Anyone who has it can change the shop, see its
orders and buyers' addresses, and take it offline, so keep it on a server, not in a web page.

A wrong or missing token answers **404**, the same as a shop that doesn't exist, so a token can't
be used to discover which shops exist.

Lost the token? A shop created while signed in also opens from the seller's `/account` page on
the website.

## Platforms: API keys

A marketplace that makes shops for its own sellers (a game store, a craft site) uses one
**platform API key** instead of keeping every shop's admin token:

```http
Authorization: Bearer ot_sk_…
```

- **Making one:** sign in on the website with **Log in with PayPal** and open
  `/account/keys` (linked from `/account`). A typed email isn't enough: keys need a verified sign-in. The key is shown
  once; OneThing stores only a hash of it.
- **What it reaches:** shops created with it (and any other shop of the same account), through
  every seller endpoint. Another account's shop answers 404.
- **Return addresses:** the https origins you register on the key are the only places
  `connectPayPal` will send your sellers back to.
- **Revoking:** one click on `/account/keys`. Calls with it get 401 at once; the shops stay.

See **Build a marketplace on OneThing** for the whole flow.

## Seller accounts: the session cookie

`signIn` takes an email address or a phone number and sets an `ot_session` cookie (there's no
password or verification, since this deployment is sandbox only). Calling `createShop` with that
cookie makes the shop belong to the account, which lists all of the seller's shops at `/account`.
The cookie doesn't replace the admin token for the API: seller endpoints still need
`x-admin-token` or an API key.

On the website, sellers can also use **Log in with PayPal** (`logInWithPayPal`), which signs them
in and records the PayPal account their sales are paid into.

## Public endpoints

No auth at all:

| Endpoint | Used by |
|---|---|
| `checkLinkName`, `searchProducts` | The create-a-shop form |
| `getPayPalClientToken`, `createCheckoutOrder`, `captureCheckoutOrder` | The shop page's PayPal button |
| `verifyAccessCode` | The seller's own app or game |
| `downloadFile`, `getImage` | Buyers' browsers |
| `listAgentShops`, `getAgentProduct`, `getAgentOrder`, `openPayLink`, `callMcp` | AI shopping agents |

Checkout can't be abused to change a price: the amount always comes from the shop, never from
the request.

## Calling from a browser (CORS)

- `verifyAccessCode` accepts calls from any website, so a static web game can check codes
  straight from the browser.
- This docs portal's **Try It!** buttons are allowed too.
- Everything else is meant for servers and other non-browser clients. Seller calls in particular
  should come from your server, where the admin token stays private.
