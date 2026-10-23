import type { Funnel, Stats } from "@/lib/stats";

// The visitors-and-conversion report, shared by the seller's manage page and /admin/stats.
// Plain markup, no hooks, so it renders on the server and in the client alike.

const fmtMoney = (cents: number, currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);
const pct = (paid: number, visitors: number) => (visitors ? `${((paid / visitors) * 100).toFixed(1)}%` : "–");

function FunnelCard({ title, hint, f, currency }: { title: string; hint: string; f: Funnel; currency: string }) {
  const rows: [string, string][] = [
    ["Visitors", String(f.visitors)],
    ["Checkouts started", String(f.started)],
    ["Paid", String(f.paid)],
    ["Conversion", pct(f.paid, f.visitors)],
    ["Revenue", fmtMoney(f.revenueCents, currency)],
  ];
  return (
    <div className="rounded-xl border border-line p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-xs text-muted">{hint}</p>
      <dl className="mt-3 grid grid-cols-2 gap-y-1 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted">{k}</dt>
            <dd className="text-right font-medium tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function TopList({ title, items, empty }: { title: string; items: { label: string; n: number }[]; empty: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      {items.length ? (
        <ul className="mt-2 space-y-1 text-sm">
          {items.map((i) => (
            <li key={i.label} className="flex justify-between gap-3">
              <span className="truncate">{i.label}</span>
              <span className="tabular-nums text-muted">{i.n}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted">{empty}</p>
      )}
    </div>
  );
}

/** Visitors per day, people and agents stacked. */
function Daily({ daily }: { daily: Stats["daily"] }) {
  if (!daily.length) return null;
  const max = Math.max(...daily.map((d) => d.web + d.agent), 1);
  return (
    <div>
      <div className="flex h-20 items-end gap-0.5" role="img" aria-label="Visitors per day">
        {daily.map((d) => (
          <div key={d.day} className="flex flex-1 flex-col justify-end" title={`${d.day}: ${d.web} people, ${d.agent} agents`}>
            <div className="bg-violet-400" style={{ height: `${(d.agent / max) * 80}px` }} />
            <div className="bg-foreground" style={{ height: `${(d.web / max) * 80}px` }} />
          </div>
        ))}
      </div>
      <p className="mt-1 flex gap-4 text-xs text-muted">
        <span><span className="mr-1 inline-block size-2 bg-foreground" />People</span>
        <span><span className="mr-1 inline-block size-2 bg-violet-400" />AI agents</span>
      </p>
    </div>
  );
}

export function StatsView({ stats, currency }: { stats: Stats; currency: string }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <FunnelCard title="Shop page" hint="People who opened the page, and their purchases" f={stats.web} currency={currency} />
        <FunnelCard title="AI agents" hint="Assistants that read the shop (MCP, JSON, order link), and orders they placed" f={stats.agent} currency={currency} />
      </div>
      <Daily daily={stats.daily} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TopList title="Where people came from" items={stats.referrers.map((r) => ({ label: r.host, n: r.visitors }))} empty="No visitors yet." />
        <TopList title="Which agents" items={stats.agents.map((a) => ({ label: a.name, n: a.visitors }))} empty="No agent visits yet." />
      </div>
    </div>
  );
}
