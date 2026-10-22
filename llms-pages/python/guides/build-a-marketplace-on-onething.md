# Build a marketplace on OneThing

Source: /#/python/x-redirect/cGFnZSUzQWd1aWRlcyUyRnBsYXRmb3Jtcw

OneThing's API is built for **platforms with many sellers**: a game portal, a craft site, a
course library. The platform keeps its own catalog and pages; OneThing makes each seller a shop
and runs the PayPal checkout, and **every sale is paid straight to that seller's own PayPal
account**. The platform never holds anyone's money.

**Worked example:** the [Mirio Games marketplace](https://www.miriogames.com/market/) lets indie
developers upload an HTML game and sell it. It's static pages on S3 plus one serverless function
that calls OneThing through the TypeScript SDK generated from this portal.


# 1. Get a key

On the website, **Log in with PayPal**, open `/account/keys` (linked from `/account`), and make a key with
your site's origin as a return address (`https://www.miriogames.com`). Keep it in your server's
secrets; never put it in a web page.

```ts
import { Client, Environment, ShopsApi, PlatformsApi, AccessCodesApi, FileWrapper } from 'one-thing-sdk';

const client = new Client({
  environment: Environment.Production,
  platformKeyCredentials: { accessToken: process.env.ONETHING_API_KEY! },
});
```


# 2. Make a shop for a seller

When a seller lists something, create a shop with your key. It belongs to your account, so the
key manages it from now on:

```ts
const shops = new ShopsApi(client);
const cover = new FileWrapper(coverBlob, { filename: 'cover.png', contentType: 'image/png' });
const { result } = await shops.createShop(
  'photo',            // source: the cover art is the photo
  cover,
  'A one-screen frog platformer with 30 levels.',
  undefined, undefined, undefined,   // url, productId, slug
  'digital',          // type
  'access_code',      // delivery: each buyer gets a code
  'https://www.miriogames.com/market/play/?g=7Hq2',   // where codes are used
  4.99,               // price
);
// result.slug → the shop; keep it with your listing
```


# 3. Let the seller connect PayPal

```ts
const { result } = await shops.connectPayPal(slug, {
  returnUrl: 'https://www.miriogames.com/market/manage/?g=7Hq2',
});
// redirect the seller's browser to result.url
```

PayPal walks the seller through signing in (or opening a business account) and sends them back to
your `returnUrl` with `?paypal=connected&shop=<slug>`. `getPayPalConnection` confirms it.


# 4. Go live and list it

```ts
await shops.updateShop(slug, { status: 'live' });

const platform = new PlatformsApi(client);
const { result } = await platform.listMyShops('live');
// result.shops → name, price, cover, url, sales: render your catalog
```

Buyers pay on the shop page (`result.shops[i].url`). Going live is refused until the seller's
PayPal account can be paid, so no sale is ever made to nowhere.


# 5. Deliver

With `delivery: access_code`, the buyer's thank-you page links to your `access_url` with
`?code=…`. Check it before unlocking:

```ts
const access = new AccessCodesApi(client);
const { result } = await access.verifyAccessCode({ shop: slug, code });
if (result.valid) { /* serve the game */ }
```

Mirio Games goes one step further: game files sit in a private S3 prefix, and only a valid code
gets a 60-second download link, so the game can't be fetched without buying it.


# What the platform gets for free

- Sellers' orders, shipping and refunds through PayPal; `listOrders` for your dashboards.
- Every shop is also on OneThing's MCP server, so AI shopping agents can find and buy your
  sellers' products (see **Let AI agents buy**).



