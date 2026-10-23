# SDK Quickstart

Source: /#/http/x-redirect/JTI0aCUyRl9fZ2V0dGluZ19zdGFydGVk


# Introduction

OneThing turns a photo, a link or a picked product into a live one-product shop that takes
PayPal payments, or a recommendation page that earns referral commissions through Channel3.

**How a shop is made**

1. `createShop`: start from a photo, a link, or a Channel3 product. Gemini guesses what it
   is, how it's delivered, the price, a short link and the page design. You get back the
   shop's link name and an **admin token**.
2. `updateShop`: correct anything the AI guessed, then set `status: live`.
3. Buyers pay on `https://<host>/<slug>` with PayPal. Sellers read orders and ship them.

**Auth.** Seller endpoints take the shop's admin token in the `x-admin-token` header, or a
**platform API key** (`Authorization: Bearer ot_sk_…`) for marketplaces that make shops for
their own sellers. Buyer endpoints (checkout, access-code verification, downloads) are public.

**Access codes.** A digital product can unlock an app or game instead of shipping a file.
Each paid order gets a code such as `K7QF-M2XP-9HTD`; your app calls `verifyAccessCode`
before unlocking. Raptor Rush on miriogames.com is a live example.

**Agent-ready.** Every live shop is also published for AI shopping agents: an MCP server at
`/api/mcp` with `search_shops`, `get_product`, `create_order` and `get_order`, and the same
reads as plain GETs for agents that can only fetch URLs (`listAgentShops`, `getAgentProduct`,
`getAgentOrder`). An agent can find and order, but the buyer still approves every payment at
PayPal.

All money moves through PayPal (sandbox in this deployment). OneThing never holds card data.


# Environments

This API has support for the following environment(s). Each environment has one or more base URIs defined.

## Production

Hackathon deployment (PayPal sandbox)

| Server | Base URI |
|  --- | --- |
| default | `https://one-thing-ash0.onrender.com` |

## Local

Local development

| Server | Base URI |
|  --- | --- |
| default | `http://localhost:3000` |

The default environment is **production** and the default server is **default**.


# Authorization

This API uses the following authentication schemes.

* [`AdminToken (Custom Header Signature)`](/llms-pages/http/getting-started/sdk-quickstart/authorization.md)
* [`PlatformKey (OAuth 2 Bearer token)`](/llms-pages/http/getting-started/sdk-quickstart/authorization.md)

## AdminToken (Custom Header Signature)



This API uses the following header parameters for authentication.

| Header | Default | Description |
|  --- | --- | --- |
| x-admin-token | *None* | The shop's admin token, returned once by `createShop`. Keep it secret. |

The request looks like this:

```bash
curl {BASEURI} \
  -H 'x-admin-token: {X-ADMIN-TOKEN}'
```

```http
GET / HTTP/1.1
Host: {HOST}
x-admin-token: {X-ADMIN-TOKEN}
```

## PlatformKey (OAuth 2 Bearer token)



The bearer token is sent in the request like this:

```bash
curl {BASEURI} -H 'Authorization: Bearer {OAUTH_TOKEN}'
```

```http
GET / HTTP/1.1
Host: {HOST}
Authorization: Bearer {OAUTH_TOKEN}
```




