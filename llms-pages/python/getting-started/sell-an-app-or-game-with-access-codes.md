# Sell an app or game with access codes

Source: /#/python/x-redirect/cGFnZSUzQWd1aWRlcyUyRmFjY2Vzcy1jb2Rlcw

A digital product doesn't have to be a file. Set `delivery: access_code` and `access_url` to
where your app runs; every paid order then gets a unique code like `K7QF-M2XP-9HTD`.

After paying, the buyer lands on the thank-you page with the code and a **Start now** button
that opens `access_url?code=<code>`.

Your app checks the code before unlocking:

```http
POST /api/access/verify
Content-Type: application/json

{ "shop": "raptorrush", "code": "K7QF-M2XP-9HTD" }
```

```json
{ "valid": true, "product": "Raptor Rush: Browser Edition" }
```

The endpoint is open to any origin, so a static web game can call it straight from the
browser. It accepts the shop's current and former link names, and codes typed in lower case
or without dashes. Each check is counted (`code_uses` on the order).

**Live example:** [Raptor Rush](https://www.miriogames.com/raptor-rush/play/) on miriogames.com
is sold at [/raptorrush](https://one-thing-ash0.onrender.com/raptorrush) and unlocks with
this call.



