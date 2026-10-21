import "server-only";
import type { PGlite } from "@electric-sql/pglite";
import type { Pool } from "pg";

// One query function for both databases:
// - DATABASE_URL set (Render, or your own Postgres) → node-postgres pool
// - unset (local dev, judges running it locally) → PGlite, real Postgres compiled to WASM,
//   persisted in node_modules/.cache (outside the dev watcher). No install, no Docker.

type Row = Record<string, unknown>;
type Db = { query<T = Row>(sql: string, params?: unknown[]): Promise<T[]> };

const SCHEMA = `
CREATE TABLE IF NOT EXISTS blobs (
  id          text PRIMARY KEY,
  mime        text NOT NULL,
  filename    text,
  data        bytea NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- One shop sells exactly one product, so the product lives on the shop row.
CREATE TABLE IF NOT EXISTS shops (
  id              text PRIMARY KEY,
  slug            text NOT NULL UNIQUE,
  admin_token     text NOT NULL,
  status          text NOT NULL DEFAULT 'draft',      -- draft | live
  seller_email    text,
  paypal_email    text,                               -- payee; null = platform account
  paypal_merchant_id text,                            -- set by Partner Referrals onboarding; wins over paypal_email
  zapier_hook_url text,
  description     text NOT NULL,                      -- what the seller typed
  product_type    text NOT NULL,                      -- digital | physical | referral
  price_cents     integer NOT NULL,
  currency        text NOT NULL DEFAULT 'USD',
  shipping_cents  integer NOT NULL DEFAULT 0,
  ship_countries  text,                               -- e.g. 'US,CA'
  stock           integer,                            -- null = unlimited
  photo_blob      text REFERENCES blobs(id),
  hero_blob       text REFERENCES blobs(id),
  hero_status     text NOT NULL DEFAULT 'none',       -- none | pending | ready | failed
  digital_blob    text REFERENCES blobs(id),
  spec            jsonb NOT NULL,                     -- Gemini's design spec (src/lib/design.ts)
  ai_source       text NOT NULL DEFAULT 'gemini',     -- gemini | fallback
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id                 text PRIMARY KEY,
  shop_id            text NOT NULL REFERENCES shops(id),
  paypal_order_id    text UNIQUE,
  status             text NOT NULL DEFAULT 'created', -- created | paid | failed
  amount_cents       integer NOT NULL,
  shipping_cents     integer NOT NULL DEFAULT 0,
  currency           text NOT NULL DEFAULT 'USD',
  buyer_email        text,
  buyer_name         text,
  shipping_address   jsonb,
  capture_id         text,
  fulfillment_status text NOT NULL DEFAULT 'none',    -- none | to_ship | shipped | digital_sent
  carrier            text,
  tracking_number    text,
  tracking_synced    boolean NOT NULL DEFAULT false,  -- pushed to PayPal's tracking API
  download_token     text UNIQUE,
  downloads          integer NOT NULL DEFAULT 0,
  created_at         timestamptz NOT NULL DEFAULT now(),
  paid_at            timestamptz
);
CREATE INDEX IF NOT EXISTS orders_shop_idx ON orders(shop_id, created_at DESC);

-- Access codes: a digital product can be a web app or game the buyer unlocks with a code,
-- instead of a file. The app checks codes with POST /api/access/verify.
ALTER TABLE shops  ADD COLUMN IF NOT EXISTS delivery text NOT NULL DEFAULT 'file';  -- file | access_code
ALTER TABLE shops  ADD COLUMN IF NOT EXISTS access_url text;                         -- where the buyer plays/uses it
ALTER TABLE orders ADD COLUMN IF NOT EXISTS access_code text UNIQUE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS code_uses integer NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS code_last_used_at timestamptz;

-- Referral shops (product_type 'referral'): a Channel3 product the seller recommends. Buyers
-- purchase at the retailer through Channel3's tracked links; the shop earns the commission.
ALTER TABLE shops ADD COLUMN IF NOT EXISTS referral jsonb;          -- src/lib/channel3.ts Referral
ALTER TABLE shops ADD COLUMN IF NOT EXISTS source_url text;         -- the link the seller pasted
ALTER TABLE shops ADD COLUMN IF NOT EXISTS hero_error text;         -- why hero art failed, for the seller/debugging
-- Public /gallery is opt-in: a live shop appears only once its seller switches this on.
ALTER TABLE shops ADD COLUMN IF NOT EXISTS in_gallery boolean NOT NULL DEFAULT false;
-- A playable showcase built from a game page's art (src/lib/showcase.ts), and the images it uses.
ALTER TABLE shops ADD COLUMN IF NOT EXISTS showcase jsonb;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS showcase_blobs text[] NOT NULL DEFAULT '{}';
-- More photos the seller adds while refining; photo_blob stays the cover, these follow it.
ALTER TABLE shops ADD COLUMN IF NOT EXISTS gallery_blobs text[] NOT NULL DEFAULT '{}';

-- Every link name a shop has had (the current one is shops.slug). Old names redirect.
CREATE TABLE IF NOT EXISTS shop_slugs (
  slug     text PRIMARY KEY,
  shop_id  text NOT NULL REFERENCES shops(id)
);
INSERT INTO shop_slugs (slug, shop_id) SELECT slug, id FROM shops ON CONFLICT (slug) DO NOTHING;

-- Every PayPal webhook delivery we can tie to a shop, so sellers can see them arrive.
CREATE TABLE IF NOT EXISTS webhook_events (
  id               text PRIMARY KEY,                  -- PayPal's event id (retries reuse it)
  shop_id          text REFERENCES shops(id),
  event_type       text NOT NULL,
  paypal_order_id  text,
  summary          text,                              -- e.g. "$2.99 USD captured"
  verified         boolean NOT NULL,
  outcome          text NOT NULL,                     -- what we did with it
  received_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS webhook_events_shop_idx ON webhook_events(shop_id, received_at DESC);
`;

async function open(): Promise<Db> {
  if (process.env.DATABASE_URL) {
    const { Pool } = await import("pg");
    const pool: Pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    });
    await pool.query(SCHEMA);
    return { query: async (sql, params) => (await pool.query(sql, params)).rows };
  }
  const { PGlite } = await import("@electric-sql/pglite");
  const dir = process.env.PGLITE_DIR ?? "./node_modules/.cache/one-thing-pglite";
  (await import("node:fs")).mkdirSync(dir, { recursive: true });
  const pg: PGlite = await PGlite.create(dir);
  await pg.exec(SCHEMA);
  return {
    query: async <T,>(sql: string, params?: unknown[]) => (await pg.query<T>(sql, params)).rows,
  };
}

// Survive dev-server hot reloads: one connection per process.
const g = globalThis as unknown as { __oneThingDb?: Promise<Db> };

export function db(): Promise<Db> {
  g.__oneThingDb ??= open().catch((err) => {
    g.__oneThingDb = undefined;
    throw err;
  });
  return g.__oneThingDb;
}

export async function query<T = Row>(sql: string, params?: unknown[]): Promise<T[]> {
  return (await db()).query<T>(sql, params);
}

export async function one<T = Row>(sql: string, params?: unknown[]): Promise<T | null> {
  return (await query<T>(sql, params))[0] ?? null;
}
