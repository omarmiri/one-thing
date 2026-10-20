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
  product_type    text NOT NULL,                      -- digital | physical
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
  const dir = process.env.PGLITE_DIR ?? "./node_modules/.cache/micro-shop-pglite";
  (await import("node:fs")).mkdirSync(dir, { recursive: true });
  const pg: PGlite = await PGlite.create(dir);
  await pg.exec(SCHEMA);
  return {
    query: async <T,>(sql: string, params?: unknown[]) => (await pg.query<T>(sql, params)).rows,
  };
}

// Survive dev-server hot reloads: one connection per process.
const g = globalThis as unknown as { __microShopDb?: Promise<Db> };

export function db(): Promise<Db> {
  g.__microShopDb ??= open().catch((err) => {
    g.__microShopDb = undefined;
    throw err;
  });
  return g.__microShopDb;
}

export async function query<T = Row>(sql: string, params?: unknown[]): Promise<T[]> {
  return (await db()).query<T>(sql, params);
}

export async function one<T = Row>(sql: string, params?: unknown[]): Promise<T | null> {
  return (await query<T>(sql, params))[0] ?? null;
}
