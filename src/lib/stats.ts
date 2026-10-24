import "server-only";
import { createHash } from "node:crypto";
import { query } from "./db";

// Visitors and conversion, split by channel: "web" (a person on the shop page) and "agent" (an AI
// agent reading the shop). Orders already carry the same channel (src/lib/orders.ts), so the
// funnel is visitors → checkouts started → paid, per channel. No cookies: a visitor is a hash of
// IP, browser and the day, which can't be reversed or followed into the next day.

export type Channel = "web" | "agent";

// Names for the agents we can recognise from the user agent. Order matters: first match wins.
const AGENTS: [RegExp, string][] = [
  [/ChatGPT|OpenAI|OAI-SearchBot|GPTBot/i, "ChatGPT"],
  [/Claude|Anthropic/i, "Claude"],
  [/Perplexity/i, "Perplexity"],
  [/Gemini|Google-Extended|Google-Agent/i, "Gemini"],
  [/Grok|xAI/i, "Grok"],
  [/Kimi|Moonshot/i, "Kimi"],
  [/Mistral/i, "Mistral"],
  [/Copilot/i, "Copilot"],
  [/Meta-External/i, "Meta AI"],
  [/DuckAssist/i, "DuckDuckGo"],
];
// Fetchers an assistant sends to read a page for a user who asked (not crawlers building an index).
const AI_FETCHER = /ChatGPT-User|Claude-User|Perplexity-User|MistralAI-User|DuckAssistBot|Google-Agent/i;
// Bots that do run JavaScript, so the beacon alone doesn't keep them out.
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|pingdom|uptime/i;

const ua = (h: Headers) => h.get("user-agent") ?? "";
const known = (s: string) => AGENTS.find(([re]) => re.test(s))?.[1];

/**
 * Who an agent request came from. A known assistant in the user agent wins, since it's the hardest
 * to fake; then the name the agent gave itself (the MCP client's clientInfo.name, or ?agent= on
 * the GET endpoints), mapped to a known name when it is one; then the user agent's first word
 * ("python-requests"). Every browser's user agent starts "Mozilla", which names nobody.
 */
export function agentName(h: Headers, claimed?: string | null) {
  const u = ua(h);
  const said = claimed?.replace(/[^\x20-\x7e]/g, "").trim().slice(0, 30);
  const first = u.split(/[/\s]/)[0].slice(0, 30);
  return known(u) ?? (said ? (known(said) ?? said) : undefined) ?? (first === "Mozilla" ? "Unidentified (browser-like)" : first || "Unknown");
}

/** An assistant fetching the shop page for someone: counts as an agent visit, not a web one. */
export const isAiFetcher = (h: Headers) => AI_FETCHER.test(ua(h));
export const isBot = (h: Headers) => !ua(h) || BOT.test(ua(h));

function visitorId(h: Headers) {
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "";
  const day = new Date().toISOString().slice(0, 10);
  // The salt keeps anyone without the server's secret from testing IPs against stored hashes.
  return createHash("sha256").update(`${process.env.ADMIN_KEY ?? ""}|${day}|${ip}|${ua(h)}`).digest("hex").slice(0, 16);
}

const host = (url: string | null | undefined) => {
  try {
    return url ? new URL(url).host.replace(/^www\./, "") || null : null;
  } catch {
    return null;
  }
};

/**
 * Counts one visit to a shop, by its id or any link name it has had. Never throws: a stats hiccup
 * must not break a page or an agent call. `from` is the referrer for a web visit (our own site
 * doesn't count) and the name the agent gave itself for an agent visit.
 */
export async function recordVisit(shop: { id: string } | { slug: string }, h: Headers, channel: Channel, from?: string | null) {
  try {
    const ref = channel === "web" ? host(from) : null;
    const own = host(process.env.APP_URL);
    await query(
      `INSERT INTO visits (shop_id, visitor, channel, agent, referrer)
       SELECT id, $2, $3, $4, $5 FROM shops
        WHERE id = $1 OR id = (SELECT shop_id FROM shop_slugs WHERE slug = $1)
        LIMIT 1
       ON CONFLICT (shop_id, day, visitor, channel) DO UPDATE SET hits = visits.hits + 1`,
      ["id" in shop ? shop.id : shop.slug, visitorId(h), channel, channel === "agent" ? agentName(h, from) : null, ref && ref !== own ? ref : null],
    );
  } catch (err) {
    console.warn("visit not recorded:", (err as Error).message);
  }
}

// ---- Reports ----------------------------------------------------------------------------------

export type Funnel = { visitors: number; views: number; started: number; paid: number; revenueCents: number };
export type Stats = {
  days: number;
  web: Funnel;
  agent: Funnel;
  agents: { name: string; visitors: number }[];
  referrers: { host: string; visitors: number }[];
  daily: { day: string; web: number; agent: number }[];
};

const empty = (): Funnel => ({ visitors: 0, views: 0, started: 0, paid: 0, revenueCents: 0 });

/** The funnel for one shop, or the whole site when shopId is null, over the last `days` days. */
export async function getStats(shopId: string | null, days: number): Promise<Stats> {
  // $1 = days, $2 = shop id or null (null: every shop).
  const params = [days, shopId];
  const visitsIn = "day > current_date - $1::int AND ($2::text IS NULL OR shop_id = $2)";
  const [visits, orders, agents, referrers, daily] = await Promise.all([
    query<{ channel: Channel; visitors: string; views: string }>(
      `SELECT channel, count(*) AS visitors, sum(hits) AS views FROM visits WHERE ${visitsIn} GROUP BY channel`,
      params,
    ),
    query<{ channel: Channel; started: string; paid: string; revenue: string }>(
      `SELECT channel, count(*) AS started, count(*) FILTER (WHERE status = 'paid') AS paid,
              coalesce(sum(amount_cents) FILTER (WHERE status = 'paid'), 0) AS revenue
         FROM orders WHERE created_at > now() - make_interval(days => $1::int) AND ($2::text IS NULL OR shop_id = $2)
        GROUP BY channel`,
      params,
    ),
    query<{ name: string; visitors: string }>(
      `SELECT agent AS name, count(*) AS visitors FROM visits WHERE channel = 'agent' AND ${visitsIn}
        GROUP BY agent ORDER BY count(*) DESC LIMIT 10`,
      params,
    ),
    query<{ host: string; visitors: string }>(
      `SELECT coalesce(referrer, 'Direct or unknown') AS host, count(*) AS visitors FROM visits WHERE channel = 'web' AND ${visitsIn}
        GROUP BY 1 ORDER BY count(*) DESC LIMIT 10`,
      params,
    ),
    query<{ day: string; web: string; agent: string }>(
      `SELECT to_char(day, 'YYYY-MM-DD') AS day, count(*) FILTER (WHERE channel = 'web') AS web,
              count(*) FILTER (WHERE channel = 'agent') AS agent
         FROM visits WHERE ${visitsIn} GROUP BY day ORDER BY day`,
      params,
    ),
  ]);
  const funnel = { web: empty(), agent: empty() };
  for (const v of visits) Object.assign(funnel[v.channel], { visitors: Number(v.visitors), views: Number(v.views) });
  for (const o of orders) Object.assign(funnel[o.channel], { started: Number(o.started), paid: Number(o.paid), revenueCents: Number(o.revenue) });
  return {
    days,
    ...funnel,
    agents: agents.map((a) => ({ name: a.name, visitors: Number(a.visitors) })),
    referrers: referrers.map((r) => ({ host: r.host, visitors: Number(r.visitors) })),
    daily: daily.map((d) => ({ day: d.day, web: Number(d.web), agent: Number(d.agent) })),
  };
}

export type ShopRow = { slug: string; name: string; status: string; web: number; agent: number; started: number; paid: number; revenueCents: number; currency: string };

/** Every shop with any visit or order in the window, busiest first: the admin page's table. */
export async function getShopStats(days: number): Promise<ShopRow[]> {
  const rows = await query<{
    slug: string; name: string; status: string; currency: string; web: string; agent: string; started: string; paid: string; revenue: string;
  }>(
    `WITH v AS (
       SELECT shop_id, count(*) FILTER (WHERE channel = 'web') AS web, count(*) FILTER (WHERE channel = 'agent') AS agent
         FROM visits WHERE day > current_date - $1::int GROUP BY shop_id),
     o AS (
       SELECT shop_id, count(*) AS started, count(*) FILTER (WHERE status = 'paid') AS paid,
              coalesce(sum(amount_cents) FILTER (WHERE status = 'paid'), 0) AS revenue
         FROM orders WHERE created_at > now() - make_interval(days => $1::int) GROUP BY shop_id)
     SELECT s.slug, s.spec->>'productName' AS name, s.status, s.currency,
            coalesce(v.web, 0) AS web, coalesce(v.agent, 0) AS agent,
            coalesce(o.started, 0) AS started, coalesce(o.paid, 0) AS paid, coalesce(o.revenue, 0) AS revenue
       FROM shops s LEFT JOIN v ON v.shop_id = s.id LEFT JOIN o ON o.shop_id = s.id
      WHERE v.shop_id IS NOT NULL OR o.shop_id IS NOT NULL
      ORDER BY coalesce(v.web, 0) + coalesce(v.agent, 0) DESC, coalesce(o.paid, 0) DESC
      LIMIT 200`,
    [days],
  );
  return rows.map((r) => ({
    slug: r.slug, name: r.name, status: r.status, currency: r.currency,
    web: Number(r.web), agent: Number(r.agent), started: Number(r.started), paid: Number(r.paid), revenueCents: Number(r.revenue),
  }));
}

/** Paid orders per visitor, as "2.5%"; "–" with no visitors. */
export const rate = (paid: number, visitors: number) => (visitors ? `${((paid / visitors) * 100).toFixed(1)}%` : "–");
